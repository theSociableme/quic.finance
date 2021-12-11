const QuicToken = artifacts.require("QuicToken");
const QuicMasterTransactions = artifacts.require("QuicMasterTransactions");
const QuicMasterFarmer = artifacts.require("QuicMasterFarmer");

module.exports = async function(deployer) {
  
  // let addr = await web3.eth.getAccounts();
  // let quicToken = await deployer.deploy(QuicToken, 0 , 1);
  // let quicMasterTransactions = await deployer.deploy(QuicMasterTransactions);
  // let quicMasterFarmer = await deployer.deploy(QuicMasterFarmer, 
  //     quicToken.address, //QuickToken
  //     addr[0],  //devaddr
  //     addr[1],  //liquidityaddr
  //     addr[2],  //comfundaddr
  //     addr[3],  //founderaddr
  //     1000, //REWARD_PER_BLOCK
  //     1,    //Start Block 
  //     45360,      //halvingAfterBlock
  //     50,   //User Deposit Fee
  //     [0,1,275,6601,19801,33001,90721,188441],    //blockDeltaStartStage
  //     [274,6600,19800,33000,90720,188440 ],  //blockDeltaEndStage
  //     [75,92,96,98,99,995,9975],   //userFeeStage
  //     [25,8,4,2,1,5,25],    //devFeeStage
  //   );


    let addr = await web3.eth.getAccounts();
    let quicToken = await deployer.deploy(QuicToken, 9702943 , 12852943);
    let quicMasterTransactions = await deployer.deploy(QuicMasterTransactions);
    let quicMasterFarmer = await deployer.deploy(QuicMasterFarmer, 
    quicToken.address, //QuickToken
    "0xf49eA18Ca30372d8A21D9Ee9e33B1fa7efb7AaE5",  //devaddr
    "0xB064d984136257E0D351D6e6951052CC0A9d52C0",  //liquidityaddr
    "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",  //comfundaddr
    "0x2598C062eF784d0eF7801B4E1Ea04a0d0f6A843a",  //founderaddr
    1000, //REWARD_PER_BLOCK
    8568943,    //Start Block 
    42000,      //halvingAfterBlock
    50,   //User Deposit Fee
    [0,1,275,6601,19801,33001,90721,188441],    //lockDeltaStartStage
    [274,6600,19800,33000,90720,188440 ],  //blockDeltaEndStage
    [75,92,96,98,99,995,9975],   //userFeeStage
    [25,8,4,2,1,5,25],    //devFeeStage
    quicMasterTransactions.address
  );

  // quicMasterFarmer.setup();
  // quicMasterFarmer.lockUpdate(85);
};
