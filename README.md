# Bank Staking
------- 1 -------
hardaht.config.js

module.exports = {
  defaultNetwork: "hardhat",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    hardhat: {},
    ropsten: {
      url: "https://ropsten.infura.io/v3/your-project-id",
      accounts: [`0x${your-private-key}`]
    }
  },
  solidity: "0.8.4",
};

------- 2 -------
npm install

- scripts/deploy.js
const bank = await Bank.deplo("token address",CoolDown Time(Seconds));

- cmd
npx hardhat run scripts/deploy.js --network ropsten

- console
Getting contract address

------- 3 ------
Add the contract address in App.js
const bankAddress = "Deployed contract Address";
const tokenAddress = "Token address";

------ 4 -------
In the frontend
- Admin panel
Deposit Pool Token

- User panel
Testing Deposit and Withdraw