// SPDX-License-Identifier: LGPL-3.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract MinerStakeToken is ERC20{
    IERC20 public immutable token;
    uint256 ratio = 100;
    
    mapping(address => uint256) public minerBalances;
    mapping(address => uint256) public balances;
    mapping(string => bool) public availMiner;

    mapping(address => uint256) public availHash;
    constructor(address _token) ERC20("Gohan Reward Token", "Gohan"){
        token = IERC20(_token);
    }

    event Registered(address indexed miner, uint256 amount);
    event Stake(address indexed staker, uint256 amount);
    
    function register(uint256 amount, string memory minerAddr) external {
        require(amount > 100 ** 18, "Minimum stake is 100 tokens");
        token.transferFrom(msg.sender, address(this), amount);
        minerBalances[msg.sender] += amount;
        availMiner[minerAddr] = true;
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
        require(availHash[msg.sender] != 0, "Lender not registered");
        token.transfer(borrower, amount);
    }

    function mine(uint256 aHash, address user) external{
      _mint(msg.sender, 1 * ratio);
      availHash[user] = aHash;
    }
}
