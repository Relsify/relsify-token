// SPDX-License-Identifier: MIT
pragma solidity  ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @custom:security-contact security@relsify.com
contract RelsifyToken is ERC20, ERC20Burnable, Pausable, AccessControl {
    // TOKEN MANAGEMENT ROLES
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ASSET_PROTECT_ROLE = keccak256("ASSET_PROTECT_ROLE");

    // CAP
    uint256 private immutable _cap;

    // ASSET PROTECTION DATA
    mapping(address => bool) internal frozen;

    // ASSET PROTECTION EVENTS
    event AddressFrozen(address indexed addr);
    event AddressUnfrozen(address indexed addr);

    constructor() ERC20("Relsify Token", "RELS") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 200000000 * 10 ** decimals());
        _cap = 350000000 * 10 ** decimals();
        _setupRole(MINTER_ROLE, msg.sender);
        _setupRole(ASSET_PROTECT_ROLE, msg.sender);
    }

    //CAP

    /**
     * @dev Returns the cap on the token's total supply.
     */
    function cap() public view virtual returns (uint256) {
        return _cap;
    }

    // PAUSE / UNPAUSE

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

   /**
     * @dev Freezes an address balance from being transferred.
     * @param _addr The new address to freeze.
     */
    function freeze(address _addr) public onlyRole(ASSET_PROTECT_ROLE) {
        require(!frozen[_addr], "Address already frozen");
        frozen[_addr] = true;
        emit AddressFrozen(_addr);
    }

    /**
     * @dev Unfreezes an address balance allowing transfer.
     * @param _addr The new address to unfreeze.
     */
    function unfreeze(address _addr) public onlyRole(ASSET_PROTECT_ROLE) {
        require(frozen[_addr], "Address already unfrozen");
        frozen[_addr] = false;
        emit AddressUnfrozen(_addr);
    }

    /**
    * @dev Gets whether the address is currently frozen.
    * @param _addr The address to check if frozen.
    * @return A bool representing whether the given address is frozen.
    */
    function isFrozen(address _addr) public view returns (bool) {
        return frozen[_addr];
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        require(!frozen[spender] && !frozen[msg.sender], "Address frozen");
        super.approve(spender, amount);
        return true;
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        require(totalSupply() + amount <= cap(), "Cap exceeded");
        _mint(to, amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        whenNotPaused
        override
    {
        require(!frozen[to] && !frozen[msg.sender], "Address frozen");
        super._beforeTokenTransfer(from, to, amount);
    }
}