//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";


contract BankStaking is Ownable {
    //ERC20 XYZ Token
    IERC20 public xyzToken;
    // Lock Flag
    bool internal locked;
    //CoolDown T
    uint256 internal ctime;
    //Deposited Time
    uint256 internal stime;
    // P1 Pool amount
    uint256 internal p1;
    // P2 Pool amount
    uint256 internal p2;
    // P3 Pool amount
    uint256 internal p3;
    //Total Staked Token Amount
    uint256 internal samount;

    //Users
    struct Staker {
        // Deposited Amount
        uint256 balance;
        // Deposited Time
        uint256 startTime;
    }

    // Lock Period
    modifier lockPeriod() {
        if(block.timestamp > stime + ctime && block.timestamp < stime + 2 * ctime){ locked = false;}
        else if (block.timestamp > stime + 2 * ctime) { locked = true;}
        _;
    }

    //Deposited Users Mapping
    mapping(address => Staker) internal stakers;

    // Events
    event Staked(address owner, uint256 amount);
    event Unstaked(address owner, uint256 amount);

    constructor(IERC20 _xyzToken, uint256 _ctime) {
        //XYZ Token
        xyzToken = _xyzToken;
        // CoolDown T
        uint256 second = 1 seconds;
        ctime = _ctime * second;
        // Deployed Time t0
        stime = block.timestamp;
        //Total Staked Amount
        samount = 0;
    }

    //
    function depositPool(uint256 _pamount) public onlyOwner {
        // Owner deposit R of XYZ Token
        require(_pamount < xyzToken.balanceOf(msg.sender), "Insufficient balance!");
        xyzToken.transferFrom(msg.sender, address(this), _pamount);
        p1 = uint256(_pamount / 5);
        p2 = uint256(3 * _pamount / 10);
        p3 = uint256(_pamount / 2);
    }

    // Setting CoolDown by owner
    function setCoolDownTime(uint256 _ctime) public onlyOwner {
        uint256 second = 1 seconds;
        ctime = _ctime * second;
    }

    //Deposit
    function deposit(uint256 _amount) public {
        require(block.timestamp <= stime + ctime, "You can't deposit XYZ token now.");
        require(_amount <= xyzToken.balanceOf(msg.sender),"Not enough XYZ token in your wallet, please try lesser amount");
        xyzToken.transferFrom(msg.sender, address(this), _amount);
        stakers[msg.sender].balance = _amount;
        stakers[msg.sender].startTime = block.timestamp;
        samount += _amount;

        emit Staked(msg.sender, _amount);
    }

    //Withdraw
    function withdraw() public lockPeriod {
        require(locked, "You can't withdraw XYZ token now, please wait...");
        require(block.timestamp > stakers[msg.sender].startTime + ctime, "Tokens cannot be withdrawn during the first CoolDown time. Please wait....");
        require(stakers[msg.sender].balance > 0, "You have no deposit");
        uint256 reward_amount = calculatedReward(msg.sender);
        uint256 tamount = reward_amount + stakers[msg.sender].balance;
        xyzToken.transfer(msg.sender, tamount);
        samount -= stakers[msg.sender].balance;

        emit Unstaked(msg.sender, tamount);
    }

    //Calculate Reward
    function calculatedReward(address _address) private returns (uint256 rewand_amount) {
        require(block.timestamp < stime + 5*ctime, "Note: Time escape, So you can't withdraw token.");

        uint256 rewardamount;
        uint256 rate = uint256(stakers[_address].balance / samount);

        if(block.timestamp > stime + 2*ctime) {
            rewardamount = rate * p1;
            p1 -= rewardamount;
        }

        if(block.timestamp > stime + 3*ctime) {
            rewardamount += rate * p2;
            p2 -= rate * p2;
        }

        if(block.timestamp > stime + 4*ctime) {
            rewardamount += rate * p3;
            p3 -= rate * p3;
        }

        return rewardamount;
    }

    //Owner withdraw
    function backWithdraw() public onlyOwner {
        require(block.timestamp > stime + 5*ctime, "You can't withdraw the remaining token");
        uint256 amount = p1+p2+p3;
        xyzToken.transfer(msg.sender, amount);
    }
}
