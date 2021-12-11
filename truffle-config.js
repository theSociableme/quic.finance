const path = require("path");
const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config({path:"./.env"});
const AccountIndex = 0;

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: { // default with truffle unbox is 7545, but we can use develop to test changes, ex. truffle migrate --network develop
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
      gas: 100000000
    },
    rinkeby_infura: {
      provider: function(){
        return new HDWalletProvider(process.env.MNEMONIC, "https://rinkeby.infura.io/v3/a814f6d3a5b247ceb86b181284b1c8b4", AccountIndex);
      },
      network_id: 4,
      gas: 10000000
    },
    kovan_infura: {
      provider: function(){
        return new HDWalletProvider(process.env.MNEMONIC, "https://kovan.infura.io/v3/a814f6d3a5b247ceb86b181284b1c8b4", AccountIndex);
      },
      network_id: 42,
      gas: 11000000, 
      gasPrice: 25000000000
    },
    ganache_local : {
      provider: function(){
        return new HDWalletProvider(process.env.MNEMONIC, "http://127.0.0.1:8545", AccountIndex);
      },
      network_id: "*"
    },
    polygon_test: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rpc-mumbai.matic.today`),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    ewt_test: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, ` https://volta-rpc.energyweb.org`),
      network_id: 73799,
      confirmations: 10,
      timeoutBlocks: 200
    },
    ewt: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, `https://rpc.energyweb.org`),
      network_id: 246,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    testnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 10,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },
  compilers: {
    solc: {
      version: "0.6.12",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  plugins: [
    'truffle-plugin-verify',
    'truffle-contract-size'
  ],
  api_keys:{
    etherscan: process.env.ETHERSCAN_API_KEY
  }
};
