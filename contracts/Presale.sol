// SPDX-License-Identifier: MIT
pragma solidity  >=0.8.10 <0.9.0;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./crowdsale/Crowdsale.sol";
import "./utils/TokenVesting.sol";

contract Presale is Crowdsale, Ownable {
    using SafeMath for uint256;
    using SafeERC20 for IERC20;

     // The token being sold
    IERC20 private _token;

    // Cap
    uint256 private _cap; // the cap for the crowdsale in wei

    // Timed
    uint256 private _openingTime; // the opening time of the crowdsale
    uint256 private _closingTime; // the closing time of the crowdsale

    // Investment Boundary
    uint256 private _minimumContribution; // minimum contribution in wei
    uint256 private _maximumContribution; // maximum contribution in wei
    mapping(address => uint256) private contributions; // mapping of address to contribution in wei

    //Token vesting account
    uint256 private _tokenVestingStartTime;
    uint256 private _tokenVestingCliffDuration;
    uint256 private _tokenVestingDuration;
    bool private _tokenVestingIsRevocable;
    mapping(address => TokenVesting) private vestings; // mapping of address to token vesting

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
        require(isOpen(), "TimedCrowdsale: not open");
        _;
    }

    constructor(
        uint256 rate,            // rate, in TKNbits
        address payable wallet,  // wallet to send Ether
        IERC20 token,            // the token
        uint256 theCap,             // total cap, in wei
        uint256 theOpeningTime,     // opening time in unix epoch seconds
        uint256 theClosingTime,      // closing time in unix epoch seconds
        uint256 theMinimumContribution, // minimum contribution in wei
        uint256 theMaximumContribution, // maximum contribution in wei
        uint256 theTokenVestingStartTime, // token vesting start time in unix epoch seconds
        uint256 theTokenVestingCliffDuration, // token vesting cliff duration in seconds
        uint256 theTokenVestingDuration, // token vesting duration in seconds
        bool theTokenVestingIsRevocable // token vesting is revocable
    )
        Crowdsale(rate, wallet, token)
    {
        require(theCap > 0, "CappedCrowdsale: cap is 0");
        // solhint-disable-next-line not-rely-on-time
        require(theOpeningTime >= block.timestamp, "TimedCrowdsale: opening time is before current time");
        // solhint-disable-next-line max-line-length
        require(theClosingTime > theOpeningTime, "TimedCrowdsale: opening time is not before closing time");
        // solhint-disable-next-line max-line-length
        require(theMinimumContribution <= theMaximumContribution, "Minimum contribution must be less than or equal to maximum contribution");
        require(theTokenVestingCliffDuration <= theTokenVestingDuration, "TokenVesting: cliff is longer than duration");
        require(theTokenVestingDuration > 0, "TokenVesting: duration is 0");
        require(theTokenVestingStartTime.add(theTokenVestingDuration) > block.timestamp, "TokenVesting: final time is before current time");
        _minimumContribution = theMinimumContribution;
        _maximumContribution = theMaximumContribution;
        _cap = theCap;
        _openingTime = theOpeningTime;
        _closingTime = theClosingTime;
        _token = token;
        _tokenVestingStartTime = theTokenVestingStartTime;
        _tokenVestingDuration = theTokenVestingDuration;
        _tokenVestingCliffDuration = theTokenVestingCliffDuration;
        _tokenVestingIsRevocable = theTokenVestingIsRevocable;

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

    // Investment Boundary

    /**
     * @dev Sets the minimum contribution.
     * @param minimumContribution The minimum contribution in wei.
     */
    function setMinimumContribution(uint256 minimumContribution) public onlyOwner {
        _minimumContribution = minimumContribution;
    }

    /**
     * @dev Sets the maximum contribution.
     * @param maximumContribution The maximum contribution in wei.
     */
    function setMaximumContribution(uint256 maximumContribution) public onlyOwner {
        _maximumContribution = maximumContribution;
    }

    /**
     * @dev Extend parent behavior requiring purchase to respect the funding cap.
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal override onlyWhileOpen view {
        super._preValidatePurchase(beneficiary, weiAmount);
        require(weiRaised().add(weiAmount) <= _cap, "CappedCrowdsale: cap exceeded");
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
     * @dev Get the amount contributed by a user
     */

    function contributedAmount () public view returns (uint256) {
        return contributions[msg.sender];
    }

    // Token Vesting

    modifier onlyWhenTokenVestingIsSet {
        require(address(vestings[msg.sender]) != address(0), "Token vesting not set yet");
        _;
     }
    
    /**
    * @dev Returns the token vesting start time.
    * @return the token vesting start time.
    */
     function tokenVestingStartTime() public view returns (uint256) {
        return _tokenVestingStartTime;
     }

    /**
    * @dev Returns the token vesting duration.
    * @return the token vesting duration.
    */
     function tokenVestingDuration() public view returns (uint256) {
        return _tokenVestingDuration;
     }

    /**
    * @dev Returns the token vesting cliff duration.
    * @return the token vesting cliff duration.
    */
     function tokenVestingCliffDuration() public view returns (uint256) {
        return _tokenVestingCliffDuration;
     }

    /**
    * @dev Returns the token vesting is revocable.
    * @return the token vesting is revocable.
    */
     function tokenVestingIsRevocable() public view returns (bool) {
        return _tokenVestingIsRevocable;
     }

    /**
    * @dev Returns the amount tokens vested that has been released in wei.
    * @return the amount tokens vested that has been released in wei.
    */
     function tokensVestedReleased() public view onlyWhenTokenVestingIsSet returns (uint256) {
        TokenVesting vesting = TokenVesting(vestings[msg.sender]);
        return vesting.released(address(_token));
     }

    /**
    * @dev Returns the amount tokens vested that can be released in wei.
    * @return the amount tokens vested that can be released in wei.
    */
     function tokensReleasableAmount () public view onlyWhenTokenVestingIsSet returns (uint256) {
        TokenVesting vesting = TokenVesting(vestings[msg.sender]);
        return vesting.releasableAmount(_token);
     }

    /**
    * @dev Returns the amount tokens vested in wei.
    * @return the amount tokens vested in wei.
    */
     function tokensVestedAmount() public view onlyWhenTokenVestingIsSet returns (uint256) {
        TokenVesting vesting = TokenVesting(vestings[msg.sender]);
        return vesting.vestedAmount(_token);
     }

    /**
     * @dev Get the Token vesting contract of the user
     */
    function getTokenVesting() public view returns (TokenVesting) {
        return vestings[msg.sender];
    }

    /**
     * @dev Set the Token vesting contract of the user
     */
    function setTokenVesting() public  {
        _setTokenVesting();
    }

    /**
     * @dev Released the token vested by the user
     */
    function releaseTokenVested() public onlyWhenTokenVestingIsSet {
        TokenVesting vesting = TokenVesting(vestings[msg.sender]);
        vesting.release(_token);
    }

    /**
     * @dev Set the Token vesting contract of the user
     */
    function _setTokenVesting() internal  {
        require(address(vestings[msg.sender]) == address(0), "Token vesting already set");
        TokenVesting vesting = new TokenVesting(msg.sender, _tokenVestingStartTime, _tokenVestingCliffDuration, _tokenVestingDuration, _tokenVestingIsRevocable);
        vestings[msg.sender] = vesting;
    }

    /**
     * @dev Source of tokens. Override this method to modify the way in which the crowdsale ultimately gets and sends
     * its tokens.
     * Transfer tokens to the user Token vesting contract
     * @param beneficiary Address performing the token purchase
     * @param tokenAmount Number of tokens to be emitted
     */
    function _deliverTokens(address beneficiary, uint256 tokenAmount) internal override(Crowdsale) {
        if (address(vestings[beneficiary]) == address(0)) {
            _setTokenVesting();
        }
        TokenVesting vesting = TokenVesting(vestings[beneficiary]);
        _token.safeTransfer(address(vesting), tokenAmount);
    }

    /**
     * @dev Extend crowdsale.
     * @param newClosingTime Crowdsale closing time
     */
    function _extendTime(uint256 newClosingTime) internal {
        require(!hasClosed(), "TimedCrowdsale: already closed");
        // solhint-disable-next-line max-line-length
        require(newClosingTime > _closingTime, "TimedCrowdsale: new closing time is before current closing time");
        emit TimedCrowdsaleExtended(_closingTime, newClosingTime);
        _closingTime = newClosingTime;
    }
}