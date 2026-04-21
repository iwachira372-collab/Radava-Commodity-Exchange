// require("@nomicfoundation/hardhat-toolbox");
require('@nomiclabs/hardhat-waffle')

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    GoerliETH:{
      url: "https://eth-goerli.g.alchemy.com/v2/cMR45eese3N8VWSTgvciKInoi990IonM",
      accounts: ['f81d1d3810470affac41aa8de7b527a1536dbe50ae003922597d48e418307e55']
    }
  }
};
// npx hardhat run scripts/deploy.js --network goerli