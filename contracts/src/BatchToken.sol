// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

// This contract is only for testing
contract BatchToken is ERC20 {
    constructor() ERC20("BatchToken", "BTK") {}

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
