import logo from './logo.svg';
import './App.css';
import {useState} from 'react';
import {ethers} from 'ethers';

import BankStaking from './artifacts/contracts/BankStaking.sol/BankStaking.json';
import KapoRewardToken from './artifacts/contracts/KapoRewardToken.sol/KapoRewardToken.json';
const bankAddress = "0xcf6c2b96E6Fc4FFE16Dc14eafdB259da8dC5a43C";
const tokenAddress = "0x92685bD2bDCBEcDa8a397172274dCBC82A567dF8";

function App() {
  const [poolAmount, setPoolAmount] = useState();
  const [coolDown, setCoolDown] = useState();
  const [depositAmount, setDepositAmount] = useState();

  async function settingPool() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(bankAddress, BankStaking.abi, signer)
      const tokenContract = new ethers.Contract(tokenAddress,KapoRewardToken.abi, signer)
      try {
        await tokenContract.approve(bankAddress,ethers.utils.parseUnits(poolAmount,18));
        await contract.depositPool(ethers.utils.parseUnits(poolAmount,18));
        console.log("Pool deposit")
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function settingCoolDown() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(bankAddress, BankStaking.abi, signer)
      try {
        await contract.setCoolDownTime(coolDown)
        console.log("Setting CoolDown")
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function ownerWithdraw() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(bankAddress, BankStaking.abi, signer)
      try {
        await contract.backWithdraw()
        console.log("Owner Withdraw")
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function deposit() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(bankAddress, BankStaking.abi, signer)
      const tokenContract = new ethers.Contract(tokenAddress,KapoRewardToken.abi, signer)
      try {
        // await tokenContract.approve(bankAddress,ethers.utils.parseUnits(depositAmount,18));
        await contract.deposit(ethers.utils.parseUnits(depositAmount,18))
        console.log("Deposit")
      } catch (err) {
        console.log("Error: ", err)
      }
    }
  }

  async function withdraw() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(bankAddress, BankStaking.abi, signer)
      try {
        await contract.withdraw()
        console.log("Withdraw")
      } catch (err) {
        console.log("Error: ", err)
      }
    }    
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>Admin Panel</p>
        <div>
          <input onChange={e=> setPoolAmount(e.target.value)} placeholder="Pool amount" />
          <button onClick={settingPool}> Pool Deposit</button>
        </div>
        <div>
          <input onChange={e=> setCoolDown(e.target.value)} placeholder='Setting T' />
          <button onClick={settingCoolDown}>CoolDown Setting</button>
        </div>
        <div>
          <button onClick={ownerWithdraw}> Owner Withdraw</button>
        </div>

        <p>User Panel</p>
        <div>
          <input onChange={e=> setDepositAmount(e.target.value)} placeholder="Deposit Amount" />
          <button onClick={ deposit}> Deposit</button>
        </div>

        <div>
          <button onClick={withdraw}>Withdraw</button>
        </div>
      </header>
    </div>
  );
}

export default App;
