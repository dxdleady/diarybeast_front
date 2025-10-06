// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title DiaryToken
 * @dev Soul-bound (non-transferable) ERC20 token for DiaryBeast app
 * Users earn tokens for writing diary entries, spend them in the shop
 */
contract DiaryToken is ERC20, Ownable {

    constructor() ERC20("DiaryToken", "DIARY") Ownable(msg.sender) {}

    /**
     * @dev Mint tokens as a reward (only owner can call)
     * @param user Address to receive tokens
     * @param amount Amount of tokens (in wei, 18 decimals)
     */
    function mintReward(address user, uint256 amount) external onlyOwner {
        _mint(user, amount);
    }

    /**
     * @dev Burn tokens from a user's balance (only owner can call)
     * Used when user makes a purchase in the shop
     * @param account Address to burn tokens from
     * @param amount Amount of tokens to burn
     */
    function burnFrom(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }

    /**
     * @dev Users can burn their own tokens
     * @param amount Amount of tokens to burn
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // Override transfer functions to make token non-transferable (soul-bound)

    function transfer(address, uint256) public pure override returns (bool) {
        revert("DiaryToken: transfers are disabled");
    }

    function transferFrom(address, address, uint256) public pure override returns (bool) {
        revert("DiaryToken: transfers are disabled");
    }

    function approve(address, uint256) public pure override returns (bool) {
        revert("DiaryToken: approvals are disabled");
    }
}
