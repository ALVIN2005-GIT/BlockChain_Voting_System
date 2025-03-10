// require("@nomicfoundation/hardhat-toolbox");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

// module.exports = {
//   solidity: "0.8.20",
//   networks: {
//     localhost: {
//       url: "http://127.0.0.1:8545", // Pastikan ini ada
//     },
//     sepolia: {
//       url: process.env.ALCHEMY_API_KEY || "", // Pastikan ini ada
//       accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
//     },
//   },
// };


module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: "0.8.20",
};