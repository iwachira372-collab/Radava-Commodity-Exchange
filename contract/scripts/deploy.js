const hre = require("hardhat");
// https://eth-goerli.g.alchemy.com/v2/-UvcByngXiiPjeHBp32py8x95cK6WqUy
async function main() {

  const Radava = await hre.ethers.getContractFactory("Radava");
  
  const radava = await Radava.deploy();
  await radava.deployed();

  console.log('Radava deployed to '+radava.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
