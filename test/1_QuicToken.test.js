const chai = require("./setupChai.js");
// const BN = web3.utils.BN;
const QuicToken = artifacts.require("QuicToken");

const expect = chai.expect;
let startingBlock;
let unlockStartBlock;
let endLockBlock;

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



contract("QuicToken", async (accounts) => {

    const[deployerAccount, recipient, anotherAccount] = accounts;

    beforeEach( async () => {
        this.startingBlock = await time.latestBlock();
        this.unlockStartBlock = this.startingBlock.addn(10);
        this.endLockBlock = this.startingBlock.addn(20);
        this.QuicToken = await QuicToken.new(this.unlockStartBlock,this.endLockBlock)
    })

    it("it is possible to update the token cap", async () => {
        let instance = await this.QuicToken;
        expect(instance.cap()).to.eventually.be.a.bignumber.equal(new BN(0));
        await instance.capUpdate(1000);
        return expect(instance.cap()).to.eventually.be.a.bignumber.equal(new BN(1000));
    })

    it("minting can only be done to the cap", async () => {
        let instance = await this.QuicToken;
        let mintedSupply = 1000;
        expect(instance.cap()).to.eventually.be.a.bignumber.equal(new BN(0));
        expect(instance.mint(recipient, mintedSupply)).to.eventually.be.rejected;
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
        await instance.capUpdate(mintedSupply);
        expect(instance.cap()).to.eventually.be.a.bignumber.equal(new BN(mintedSupply));
        expect(instance.mint(recipient, 1000)).to.eventually.be.fulfilled;
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(mintedSupply));
    })

    it("all tokens should be in my account", async () => {
        let instance = await this.QuicToken;
        let totalSupply = await instance.totalSupply();
        return expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(totalSupply);
    })

    it("is possible to send tokens between accounts", async () => {
        const sendTokens = 10;
        let instance = await this.QuicToken;
        let mintedSupply = 1000;
        let cap = 100000000;
        expect(instance.cap()).to.eventually.be.a.bignumber.equal(new BN(0));
        expect(instance.mint(deployerAccount, mintedSupply)).to.eventually.be.rejected;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(0));
        expect(instance.capUpdate(cap)).to.eventually.be.fulfilled;
        expect(instance.cap()).to.eventually.be.a.bignumber.equal(new BN(cap));
        expect(instance.mint(deployerAccount, 1000)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(mintedSupply));
        expect(instance.transfer(recipient, sendTokens)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(deployerAccount)).to.eventually.be.a.bignumber.equal(new BN(mintedSupply).sub(new BN(sendTokens)));
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(sendTokens));
    })

    it("Can lock some of the balance", async () => {
        let instance = await this.QuicToken;
        let cap = 100000000;
        expect(instance.capUpdate(cap)).to.eventually.be.fulfilled;
        expect(instance.mint(recipient, 1000)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1000));
        expect(instance.lock(recipient, 500)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(500));
        expect(instance.lockOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(500));
        return expect(instance.balanceOf(instance.address)).to.eventually.be.a.bignumber.equal(new BN(500));
    })

    it("unlocks amount spread accros blocks", async () => {
        let instance = await this.QuicToken;
        let cap = 100000000;
        expect(instance.capUpdate(cap)).to.eventually.be.fulfilled;
        expect(instance.mint(recipient, 1000)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1000));
        expect(instance.lock(recipient, 500)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(500));
        expect(instance.balanceOf(instance.address)).to.eventually.be.a.bignumber.equal(new BN(500));
        expect(instance.canUnlockAmount(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
        await time.advanceBlockTo(this.unlockStartBlock);
        expect(instance.canUnlockAmount(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
        await time.advanceBlockTo(this.unlockStartBlock.addn(5));
        expect(instance.canUnlockAmount(recipient)).to.eventually.be.a.bignumber.equal(new BN(250));
        await time.advanceBlockTo(this.endLockBlock);
        return expect(instance.canUnlockAmount(recipient)).to.eventually.be.a.bignumber.equal(new BN(500));
    })

    it("can unlock amounts", async () => {
        let instance = await this.QuicToken;
        let cap = 100000000;
        expect(instance.capUpdate(cap)).to.eventually.be.fulfilled;
        expect(instance.mint(recipient, 1000)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1000));
        expect(instance.lock(recipient, 500)).to.eventually.be.fulfilled;
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(500));
        expect(instance.balanceOf(instance.address)).to.eventually.be.a.bignumber.equal(new BN(500));
        expect(instance.canUnlockAmount(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
        await time.advanceBlockTo(this.unlockStartBlock);
        expect(instance.canUnlockAmount(recipient)).to.eventually.be.a.bignumber.equal(new BN(0));
        await time.advanceBlockTo(this.unlockStartBlock.addn(5));
        await instance.unlock({from:recipient});
        expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(800));
        await time.advanceBlockTo(this.endLockBlock);
        await instance.unlock({from:recipient});
        return expect(instance.balanceOf(recipient)).to.eventually.be.a.bignumber.equal(new BN(1000));
    })


})