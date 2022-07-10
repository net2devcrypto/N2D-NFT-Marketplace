require("@nomiclabs/hardhat-waffle");

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      chainId: 31337,
      url: "http://node.a3b.io:8545",
      accounts: [hhprivKey]
    },
    mumbai: {
      chainId: 80001,
      url: "https://rpc-mumbai.matic.today",
      accounts: [ethprivKey]
    },
    polygon: {
      chainId: 137,
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [ethprivKey]
    },
    ethereum: {
      chainId: 1,
      url: "https://main-rpc.linkpool.io",
      accounts: [ethprivKey]
    },
    binance: {
      chainId: 57,
      url: "https://bscrpc.com",
      accounts: [ethprivKey]
    },
    bsctest: {
      chainId: 97,
      url: "https://data-seed-prebsc-1-s3.binance.org:8545",
      accounts: [ethprivKey]
    },
    kovan: {
      chainId: 42,
      url: "https://kovan.infura.io/v3/3cf2d8833a2143b795b7796087fff369",
      accounts: [ethprivKey]
    }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};

