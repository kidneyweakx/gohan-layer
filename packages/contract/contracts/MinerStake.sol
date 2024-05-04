// SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MinerStake {
    IERC20 public immutable token;

    mapping(address => uint256) public minerBalances;
    mapping(address => uint256) public balances;
    constructor(address _token) {
        token = IERC20(_token);
    }

    event Registered(address indexed miner, uint256 amount);
    event Stake(address indexed staker, uint256 amount);
    function register(uint256 amount) external {
        require(amount > 100 ** 18, "Minimum stake is 100 tokens");
        token.transferFrom(msg.sender, address(this), amount);
        minerBalances[msg.sender] += amount;
        emit Registered(msg.sender, amount);
    }

    function withdraw(uint256 amount) external {
        require(minerBalances[msg.sender] >= amount, "Insufficient balance");
        minerBalances[msg.sender] -= amount;
        token.transfer(msg.sender, amount);
    }

    function minerBalanceOf(address account) external view returns (uint256) {
        return minerBalances[account];
    }

    // lending system
    function stake(uint256 amount) external {
        balances[msg.sender] += amount;
        emit Stake(msg.sender, amount);
    }

    function lend(address borrower, uint256 amount) external {
        // verify proof here
        token.transfer(borrower, amount);
    }
}
