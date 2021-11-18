// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.0;

import "./Crowdsale.sol";

abstract contract InvestmentBoundaryCrowdsale is Crowdsale {
    uint256 private minInvestment; // minimum investment amount in wei
    uint256 private maxInvestment; // maximum investment amount in wei

    constructor (uint256 _minInvestment, uint256 _maxInvestment)  {
        require(minInvestment <= maxInvestment, "minInvestment must be less than or equal to maxInvestment");
        minInvestment = _minInvestment;
        maxInvestment = _maxInvestment;
    }

     /**
     * @dev Extend parent behavior requiring purchase to respect the beneficiary's funding amount.
     * @param beneficiary Token purchaser
     * @param weiAmount Amount of wei contributed
     */
    function _preValidatePurchase(address beneficiary, uint256 weiAmount) internal virtual override view {
        super._preValidatePurchase(beneficiary, weiAmount);
        // solhint-disable-next-line max-line-length
        require(weiAmount >= minInvestment , "Amount must be greater than or equal to minInvestment");
        // solhint-disable-next-line max-line-length
        require(weiAmount <= maxInvestment , "Amount must be less than or equal to maxInvestment");
    }

}