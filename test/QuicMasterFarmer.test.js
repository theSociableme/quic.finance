const chai = require("./setupChai.js");
const truffleAssert = require('truffle-assertions');
const QuicToken = artifacts.require("QuicToken");
const QuicMasterTransactions = artifacts.require("QuicMasterTransactions");
const QuicMasterFarmer = artifacts.require("QuicMasterFarmer");
const expect = chai.expect;

require('@openzeppelin/test-helpers/configure')({
    provider: web3.currentProvider,
    singletons: {
      abstraction: 'truffle',
    },
  });

const { time,
    BN,           // Big Number support
    constants,    // Common constants, like the zero address and largest integers
    expectEvent,  // Assertions for emitted events
    expectRevert,  } = require('@openzeppelin/test-helpers');

let startingBlock;
let unlockStartBlock;
let endLockBlock;

contract("QuicMasterFarmer", async (accounts) => {

    const[deployerAccount, recipient, anotherAccount] = accounts;
    let addr = accounts;

    beforeEach( async () => {
        this.startingBlock = await time.latestBlock();
        this.unlockStartBlock = this.startingBlock.addn(100);
        this.endLockBlock = this.startingBlock.addn(2000);
        this.QuicToken = await QuicToken.new(this.unlockStartBlock,this.endLockBlock);
        this.QuicMasterTransactions = await QuicMasterTransactions.new();
        //this.myQuicMasterFarmer = await QuicMasterFarmer.deployed();
        this.myQuicMasterFarmer = await QuicMasterFarmer.new(
            this.QuicToken.address, //QuickToken
            addr[0],  //devaddr
            addr[2],  //liquidityaddr
            addr[3],  //comfundaddr
            addr[4],  //founderaddr
            1000, //REWARD_PER_BLOCK
            this.startingBlock,    //Start Block 
            100,      //halvingAfterBlock
            50,   //User Deposit Fee
            [0,1,275,6601,19801,33001,90721,188441],    //lockDeltaStartStage
            [274,6600,19800,33000,90720,188440 ],  //blockDeltaEndStage
            [75,92,96,98,99,995,9975,9999 ],   //userFeeStage
            [25,8,4,2,1,5,25,1],   //devFeeStage
            this.QuicMasterTransactions.address
          );
          await this.myQuicMasterFarmer.setup();
          await this.myQuicMasterFarmer.lockUpdate(85);
          await this.myQuicMasterFarmer.lockdevUpdate(6);
          await this.myQuicMasterFarmer.lockfounderUpdate(6);
          await this.myQuicMasterFarmer.lockcomUpdate(4);
          await this.myQuicMasterFarmer.locklpUpdate(6);
    })

    it("it has the correct QuicToken Address", async () => {
        let instance = this.myQuicMasterFarmer;
        let quicToken = this.QuicToken
        return expect(instance.Quic()).to.eventually.be.equal(quicToken.address);
    })

    it("returns the correct pool length", async () => {
        let instance = this.myQuicMasterFarmer;
        return expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("can add an LP pool", async () => {
        let instance = await this.myQuicMasterFarmer;
        await instance.add(100, "0x94b0a3d511b6ecdb17ebf877278ab030acb0a878", true);
        return expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(1));
    })

    it("can't add an LP pool twice", async () => {
        let instance = await this.myQuicMasterFarmer;
        await instance.add(100, "0x94b0a3d511b6ecdb17ebf877278ab030acb0a878", true);
        expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(1));
        truffleAssert.fails(instance.add(100, "0x94b0a3d511b6ecdb17ebf877278ab030acb0a878", true));
        return expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(1));
    })

    it("only owner can add LP pool", async () => {
        let instance = await this.myQuicMasterFarmer;
        truffleAssert.fails(instance.add(100, "0x94b0a3d511b6ecdb17ebf877278ab030acb0a878", true, {from: recipient}));
        return expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(0));
    })

    it("it can return the multiplier", async () => {
        let instance = await this.myQuicMasterFarmer;
        expect(instance.getMultiplier(this.startingBlock, this.startingBlock.addn(8))).to.eventually.be.a.bignumber.equal(new BN(32768));
        return expect(instance.getMultiplier(this.startingBlock, this.startingBlock.addn(11))).to.eventually.be.a.bignumber.equal(new BN(45056));
    })

    it("it can return the rewardPool", async () => {
        let instance = await this.myQuicMasterFarmer;
        //console.log("Quic cap " + await this.QuicToken.cap());
        //console.log("Quic total supply " + await this.QuicToken.totalSupply());
        await this.QuicToken.capUpdate(1000000000);
        //console.log("Quic cap " + await this.QuicToken.cap());
        //console.log("Quic total supply " + await this.QuicToken.totalSupply());
        await instance.add(100, "0x94b0a3d511b6ecdb17ebf877278ab030acb0a878", true);
       // console.log(await instance.getPoolReward(2,10, 100));
        // return expect(instance.getPoolReward(2,10, 100)).to.eventually.be.equal({
        //     "0": new BN(0),
        //     "1": new BN(1000),
        //     "2": new BN(0),
        //     "3": new BN(0),
        //     "4": new BN(0),
        //     forDev: new BN(0),
        //     forFarmer: new BN(1000),
        //     forLP: new BN(0),
        //     forCom: new BN(0),
        //     forFounders: new BN(0)    
        // });
        return expect(instance.getPoolReward(2,10, 100)).to.eventually.be.fulfilled;
        //return expect(instance.getMultiplier(2,11)).to.eventually.be.a.bignumber.equal(new BN(2304));
    })

    it("it will accept a deposit", async () => {
        let instance = await this.myQuicMasterFarmer;
        await this.QuicToken.capUpdate(100000000000);
        await instance.add(100, this.QuicToken.address, false);
        await this.QuicToken.mint(deployerAccount, 10000);
        await this.QuicToken.mint(instance.address, 1000000000);
        await this.QuicToken.transfer(recipient, 1000);
        await this.QuicToken.transferOwnership(instance.address);
        expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(1));
        // console.log("Deployer/Dev balance " + await this.QuicToken.balanceOf(deployerAccount));
        // console.log("Recipient balance " + await this.QuicToken.balanceOf(recipient));
        // console.log("Master Farmer balance " + await this.QuicToken.balanceOf(instance.address));
        // console.log("Total Supply " + await this.QuicToken.totalSupply());
        // console.log("QuicToken Address: " + this.QuicToken.address );
        expect(this.QuicToken.approve(instance.address, 500, {from: recipient})).to.eventually.be.fulfilled;
        return expect(instance.deposit(0, 500, recipient, {from: recipient})).to.eventually.be.fulfilled;
        // console.log("Deployer/Dev balance " + await this.QuicToken.balanceOf(deployerAccount));
        // console.log("Recipient balance " + await this.QuicToken.balanceOf(recipient));
        // console.log("Master Farmer balance " + await this.QuicToken.balanceOf(instance.address));
        // console.log("Total Supply " + await this.QuicToken.totalSupply());
        // console.log("Global Amount " + await instance.getGlobalAmount(recipient));
        // console.log("Pending Reward " + await instance.pendingReward(0, recipient));
    })

    it("can update the lock value", async () => {
        let instance = await this.myQuicMasterFarmer;
        expect(instance.PERCENT_LOCK_BONUS_REWARD()).to.eventually.be.a.bignumber.equal(new BN(85));
        expect(instance.lockUpdate(95)).to.eventually.be.fulfilled;
        return expect(instance.PERCENT_LOCK_BONUS_REWARD()).to.eventually.be.a.bignumber.equal(new BN(95));
    })

    it("it will make a withdraw and lock", async () => {
        let instance = await this.myQuicMasterFarmer;
        await this.QuicToken.capUpdate(100000000000);
        await instance.add(5000, this.QuicToken.address, false);
        await this.QuicToken.mint(deployerAccount, 10000);
        await this.QuicToken.mint(instance.address, 1000000000);
        await this.QuicToken.transfer(recipient, 1000);
        await this.QuicToken.transferOwnership(instance.address);
        expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(1));
        // console.log("Deployer/Dev balance " + await this.QuicToken.balanceOf(deployerAccount));
        // console.log("Recipient balance " + await this.QuicToken.balanceOf(recipient));
        // console.log("Master Farmer balance " + await this.QuicToken.balanceOf(instance.address));
        // console.log("Total Supply " + await this.QuicToken.totalSupply());
        // console.log("QuicToken Address: " + this.QuicToken.address );
        expect(this.QuicToken.approve(instance.address, 500, {from: recipient})).to.eventually.be.fulfilled;
        await instance.deposit(0, 500, recipient, {from: recipient});
        expect(this.QuicToken.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(500));
        // console.log("Deployer/Dev balance " + await this.QuicToken.balanceOf(deployerAccount));
        // console.log("Recipient balance " + await this.QuicToken.balanceOf(recipient));
        // console.log("Master Farmer balance " + await this.QuicToken.balanceOf(instance.address));
        // console.log("Total Supply " + await this.QuicToken.totalSupply());
        // console.log("Global Amount " + await instance.getGlobalAmount(recipient));
        // console.log("Pending Reward " + await instance.pendingReward(0, recipient));
        expect(instance.withdraw(0, 498, recipient, {from: recipient})).to.eventually.be.fulfilled;
        return expect(this.QuicToken.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(959));
        // console.log("Deployer/Dev balance " + await this.QuicToken.balanceOf(deployerAccount));
        // console.log("Recipient balance " + await this.QuicToken.balanceOf(recipient));
        // console.log("Master Farmer balance " + await this.QuicToken.balanceOf(instance.address));
        // console.log("Total Supply " + await this.QuicToken.totalSupply());
        // console.log("Global Amount " + await instance.getGlobalAmount(recipient));
        // console.log("Pending Reward " + await instance.pendingReward(0, recipient));
    })

    it("it can revise a deposit", async () => {
        let instance = await this.myQuicMasterFarmer;
        await this.QuicToken.capUpdate(100000000000);
        await instance.add(5000, this.QuicToken.address, false);
        await this.QuicToken.mint(deployerAccount, 10000);
        await this.QuicToken.mint(instance.address, 1000000000);
        await this.QuicToken.transfer(recipient, 1000);
        await this.QuicToken.transferOwnership(instance.address);
        expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(1));
        expect(this.QuicToken.approve(instance.address, 500, {from: recipient})).to.eventually.be.fulfilled;
        await instance.deposit(0, 500, recipient, {from: recipient});
        expect(this.QuicToken.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(500));
        let result = await instance.userInfo(0, recipient)
        console.log("last withdraw block " + result[3].toNumber());
        console.log("first deposit block " + result[4].toNumber());
        expect(instance.reviseWithdraw(0, recipient, 12345)).to.eventually.be.fulfilled;
        expect(instance.reviseDeposit(0, recipient, 54321)).to.eventually.be.fulfilled;
        result = await instance.userInfo(0, recipient)
        console.log("last withdraw block " + result[3].toNumber());
        console.log("first deposit block " + result[4].toNumber());
        expect(result[3].toNumber()).to.equal(12345);
        return expect(result[4].toNumber()).to.equal(54321);
    })

    it("it sets up correctly", async () => {
        let instance = await this.myQuicMasterFarmer;
        expect(instance.HALVING_AT_BLOCK(0)).to.eventually.be.a.bignumber.equal(new BN(this.startingBlock.addn(100)));
        expect(instance.HALVING_AT_BLOCK(1)).to.eventually.be.a.bignumber.equal(new BN(this.startingBlock.addn(200)));
        return expect(instance.FINISH_BONUS_AT_BLOCK()).to.eventually.be.a.bignumber.equal(new BN(this.startingBlock.addn(101 * 100)));
    })

    it("it updates the pool correctly", async () => {
        let instance = await this.myQuicMasterFarmer;
        await this.QuicToken.capUpdate(100000000000);
        await instance.add(100, this.QuicToken.address, false);
        await this.QuicToken.mint(deployerAccount, 10000);
        await this.QuicToken.mint(instance.address, 1000000000);
        await this.QuicToken.transfer(recipient, 2000);
        await this.QuicToken.transferOwnership(instance.address);
        expect(instance.poolLength()).to.eventually.be.a.bignumber.equal(new BN(1));
        expect(this.QuicToken.approve(instance.address, 1000, {from: recipient})).to.eventually.be.fulfilled;
        console.log("**************")
        console.log(await instance.deposit.estimateGas(0, 1000, recipient, {from: recipient}));
        console.log("**************")
        expect(instance.deposit(0, 1000, recipient, {from: recipient})).to.eventually.be.fulfilled;
        expect(this.QuicToken.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1000));
        await instance.updatePool(0);
        let result = await instance.poolInfo(0)
        expect(result[0]).to.equal(this.QuicToken.address);
        expect(result[1].toNumber()).to.equal(100);
        // console.log("lastRewardBlock " + result[2].toNumber());
        // console.log("accQuicPerShare " + result[3].toNumber());
        expect(result[3].toNumber()).to.equal(28573747363);
        result = await instance.pendingReward(0, recipient)
        expect(result.toNumber()).to.equal(4);
        await time.advanceBlockTo(this.endLockBlock);
        result = await instance.pendingReward(0, recipient)
        expect(result.toNumber()).to.equal(1282);
        expect(this.QuicToken.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1000));
        expect(instance.claimReward(0, {from: recipient})).to.eventually.be.fulfilled;
        expect(this.QuicToken.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1193));
        expect(this.QuicToken.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(20262080));
        console.log("**************")
        //console.log(await instance.deposit.estimateGas(0, 10, recipient, {from: recipient}));
        console.log("**************")
    })


})