// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Batching} from "../src/Batching.sol";
import {BatchToken} from "../src/BatchToken.sol";

contract CounterTest is Test {
    address public aman = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
    address public yash = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
    address public ankit = 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC;

    BatchToken public batchToken;
    Batching public batching;

    function setUp() public {
        batchToken = new BatchToken();
        batching = new Batching();
    }

    function test_Mint() public {
        vm.prank(aman);
        batchToken.mint(100 ether);
        uint256 theBalance = batchToken.balanceOf(aman);
        assertEq(theBalance, 100 ether);
    }

    function test_BatchEther() public {
        vm.prank(aman);

        address[] memory persons = new address[](2);
        persons[0] = yash;
        persons[1] = ankit;

        uint256[] memory values = new uint256[](2);
        values[0] = 10 ether;
        values[1] = 20 ether;

        batching.batchingETHTransactions{value: 30 ether}(persons, values);

        assertEq(yash.balance, values[0]);
        assertEq(ankit.balance, values[1]);
    }

    function test_BatchToken() public {
        test_Mint();
        vm.prank(aman);
        batchToken.approve(address(batching), 1000 ether);

        address[] memory persons = new address[](2);
        persons[0] = yash;
        persons[1] = ankit;

        uint256[] memory values = new uint256[](2);
        values[0] = 10 ether;
        values[1] = 20 ether;

        batching.batchTokenTransactions(batchToken, persons, values);

        uint256 balanceOfYash = batchToken.balanceOf(yash);
        uint256 balanceOfAnkit = batchToken.balanceOf(ankit);

        assertEq(balanceOfYash, values[0]);
        assertEq(balanceOfAnkit, values[1]);
    }
}
