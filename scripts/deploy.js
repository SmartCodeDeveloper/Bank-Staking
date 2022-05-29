// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  
  const Bank = await hre.ethers.getContractFactory("BankStaking");

  const bank = await Bank.deploy("0x92685bD2bDCBEcDa8a397172274dCBC82A567dF8",180);

  await bank.deployed();

  console.log("Bank Contract Address:", bank.address);
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
//0x2aEbe3BC49E4cc23D99F790faE8b0Dc5fe3520a0