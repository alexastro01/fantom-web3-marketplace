require("@nomicfoundation/hardhat-toolbox");
require("hardhat-gas-reporter");
require('dotenv').config();
require("@nomiclabs/hardhat-etherscan");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.7",
  gasReporter: {
    enabled: true,
  
  },
  networks: {
    hardhat: {},
  
    fantom: {
      url: "https://rpc.ankr.com/fantom",
      accounts: [`${process.env.ACCOUNT}`]
    },
   
 },
 etherscan: {
  url:"https://api.ftmscan.com/api",
  apiKey: {
     opera: `${process.env.FTM_KEY}`,
  },

},
};
