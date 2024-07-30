// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

contract Batching {
    address public owner;

    receive() external payable {}

    /**
     *
     * @param persons - All the persons addresses who will recieve Ethers
     * @param values - The values or number of Ethers persons will recieve
     */
    function batchingETHTransactions(
        address[] memory persons,
        uint256[] memory values
    ) external payable {
        require(
            persons.length == values.length,
            "arrays must have the same length"
        );

        uint256 totalValue = 0;
        for (uint256 i = 0; i < values.length; i++) {
            totalValue += values[i];
        }

        require(
            msg.value == totalValue,
            "ETH ammount should be equal to all values combined"
        );

        for (uint256 i = 0; i < persons.length; i++) {
            (bool success, bytes memory data) = persons[i].call{
                value: values[i]
            }("");
            require(success, "ETH transaction failed");
        }
    }

    /**
     *
     * @param persons - All the persons addresses who will recieve Ethers
     * @param amounts - The values or number of tokens persons will recieve
     */
    function batchTokenTransactions(
        IERC20 _token,
        address[] memory persons,
        uint256[] memory amounts
    ) external {
        require(
            persons.length == amounts.length,
            "arrays must have the same length"
        );

        for (uint256 i = 0; i < persons.length; i++) {
            require(
                _token.transferFrom(msg.sender, persons[i], amounts[i]),
                "Token transfer failed"
            );
        }
    }
}
