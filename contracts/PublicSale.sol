// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./crowdsale/Crowdsale.sol";

contract PublicSale is Crowdsale, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    // The Token wallet
    address private _tokenWallet;

    // Cap
    uint256 private _cap; // the cap for the crowdsale in wei

    // Timed
    uint256 private _openingTime; // the opening time of the crowdsale
    uint256 private _closingTime; // the closing time of the crowdsale

    // Investment Boundary
    uint256 private _minimumContribution; // minimum contribution in wei
    uint256 private _maximumContribution; // maximum contribution in wei
    mapping(address => uint256) private contributions; // mapping of address to contribution in wei

    /**
     * Event for crowdsale extending
     * @param newClosingTime new closing time
     * @param prevClosingTime old closing time
     */
    event TimedCrowdsaleExtended(uint256 prevClosingTime, uint256 newClosingTime);

    /**
     * @dev Reverts if not in crowdsale time range.
     */
    modifier onlyWhileOpen {
        require(isOpen(), "Crowdsale not open");
        _;
    }

    constructor(
        uint256 rate,            // rate, in TKNbits
        address payable wallet,  // wallet to send Ether
        IERC20 token,            // the token
        address theTokenWallet, // The wallet to send the tokens from
        uint256 theCap,             // total cap, in wei
        uint256 theOpeningTime,     // opening time in unix epoch seconds
        uint256 theClosingTime,      // closing time in unix epoch seconds
        uint256 theMinimumContribution, // minimum contribution in wei
        uint256 theMaximumContribution // maximum contribution in wei
    )
        Crowdsale(rate, wallet, token)
    {
        require(theCap > 0, "Cap is 0");
        // solhint-disable-next-line not-rely-on-time
        require(theOpeningTime >= block.timestamp, "Opening time is before current time");
        // solhint-disable-next-line max-line-length
        require(theClosingTime > theOpeningTime, "Opening time is not before closing time");
        // solhint-disable-next-line max-line-length
        require(theMinimumContribution <= theMaximumContribution, "Minimum contribution must be less than or equal to maximum contribution");
        require(theTokenWallet != address(0), "Token wallet is the zero address");
        _tokenWallet = theTokenWallet;
        _minimumContribution = theMinimumContribution;
        _maximumContribution = theMaximumContribution;
        _cap = theCap;
        _openingTime = theOpeningTime;
        _closingTime = theClosingTime;
    }

    //Timed

    /**
     * @dev Returns the opening time of the crowdsale.
     * @return the crowdsale opening time.
     */
    function openingTime() public view returns (uint256) {
        return _openingTime;
    }

    /**
     * @dev Returns the crowdsale closing time.
     * @return the crowdsale closing time.
     */
    function closingTime() public view returns (uint256) {
        return _closingTime;
    }

    /**
     * @dev Returns true if the crowdsale is open.
     * @return true if the crowdsale is open, false otherwise.
     */
    function isOpen() public view returns (bool) {
        // solhint-disable-next-line not-rely-on-time
        return block.timestamp >= _openingTime && block.timestamp <= _closingTime;
    }

     /**
     * @dev Checks whether the period in which the crowdsale is open has already elapsed.
     * @return Whether crowdsale period has elapsed
     */
    function hasClosed() public view returns (bool) {
        // solhint-disable-next-line not-rely-on-time
        return block.timestamp > _closingTime;
    }

    /**
     * @dev Extends the time of the crowdsale.
     * @param newClosingTime The new closing time.
     */
    function extendTime(uint256 newClosingTime) public onlyOwner {
        _extendTime(newClosingTime);
    }

    //Cappped

    /**
     * @dev Returns the cap of the crowdsale.
     * @return the cap of the crowdsale.
     */
    function cap() public view returns (uint256) {
        return _cap;
    }

    /**
     * @dev Checks whether the cap has been reached.
     * @return Whether the cap was reached
     */
    function capReached() public view returns (bool) {
        return weiRaised() >= _cap;
    }

    // TOKEN WALLET

    /**
     * @return the address of the wallet that will hold the tokens.
     */
    function tokenWallet() public view returns (address) {
        return _tokenWallet;
    }

    /**
     * @dev Checks the amount of tokens left in the allowance.
     * @return Amount of tokens left in the allowance
     */
    function remainingTokens() public view returns (uint256) {
        return Math.min(token().balanceOf(_tokenWallet), token().allowance(_tokenWallet, address(this)));
    }

    // Investment Boundary

    /**
     * @dev Gets the minimum contribution in wei
     * @return The minimum contribution in wei
     */
    function minimumContribution() public view returns (uint256) {
        return _minimumContribution;
    }

    /**
     * @dev Gets the maximum contribution in wei
     * @return The maximum contribution in wei
     */
    function maximumContribution() public view returns (uint256) {
        return _maximumContribution;
    }

    /**
     * @dev Sets the minimum contribution.
     * @param theMinimumContribution The minimum contribution in wei.
     */
    function setMinimumContribution(uint256 theMinimumContribution) public onlyOwner {
        _minimumContribution = theMinimumContribution;
    }

    /**
     * @dev Sets the maximum contribution.
     * @param theMaximumContribution The maximum contribution in wei.
     */
    function setMaximumContribution(uint256 theMaximumContribution) public onlyOwner {
        _maximumContribution = theMaximumContribution;
    }

     /**
     * @dev Get the amount contributed by a user
     */

    function contributedAmount () public view returns (uint256) {
        return contributions[msg.sender];
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect the funding cap.
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal override onlyWhileOpen view {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(weiRaised().add(weiAmount) <= _cap, "Cap exceeded");
        uint256 _totalContibutorContribution = _getTotalContibutorContribution(beneficiary, weiAmount);
        // solhint-disable-next-line max-line-length
        require(_totalContibutorContribution >= _minimumContribution && _totalContibutorContribution <= _maximumContribution, "Contribution must be between minimum and maximum");
    }

    /**
     * @dev Extend current user contributions
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei involved in the purchase
     */
    function _updatePurchasingState(address beneficiary, uint256 weiAmount) override internal {
        contributions[beneficiary] = _getTotalContibutorContribution(beneficiary, weiAmount);
    }

    /**
     * @dev Extend parent behavior to reset user contributions
     * @param beneficiary Address receiving the tokens
     * @param weiAmount Value in wei involved in the purchase
     */
    function _getTotalContibutorContribution(address beneficiary, uint256 weiAmount) internal  view returns (uint256) {
        uint256 _existingContribution = contributions[beneficiary];
        uint256 _totalContibutorContribution = _existingContribution.add(weiAmount);
        return _totalContibutorContribution;
    }

     /**
     * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends
     * its tokens.
     * Transfer tokens to the user Token vesting contract
     * @param beneficiary Address performing the token purchase
     * @param tokenAmount Number of tokens to be emitted
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal override(Crowdsale) {
        token().safeTransferFrom(_tokenWallet, beneficiary, tokenAmount);
    }

    /**
     * @dev Extend crowdsale.
     * @param newClosingTime Crowdsale closing time
     */
    function _extendTime(uint256 newClosingTime) internal {
        require(!hasClosed(), "Crowdsale already closed");
        // solhint-disable-next-line max-line-length
        require(newClosingTime > _closingTime, "New closing time is before current closing time");
        emit TimedCrowdsaleExtended(_closingTime, newClosingTime);
        _closingTime = newClosingTime;
    }
}