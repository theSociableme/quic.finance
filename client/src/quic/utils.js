import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'
import { supportedPools } from './lib/constants'
import Web3 from 'web3'

const web3 = new Web3();
const BN = web3.utils.BN;

BigNumber.config({
	EXPONENTIAL_AT: 1000,
	DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
	STAKING: {
		DEFAULT: 200000,
		SNX: 850000,
	},
}

export const getMasterChefAddress = (quic) => {
	return quic && quic.masterChefAddress
}

export const getWethPriceAddress = (quic) => {
	return quic && quic.wethPriceAddress
}

export const getQuicPriceAddress = (quic) => {
	return quic && quic.quicPriceAddress
}

export const getQuicAddress = (quic) => {
	return quic && quic.quicAddress
}
export const getWethContract = (quic) => {
	return quic && quic.contracts && quic.contracts.weth
}

export const getWethPriceContract = (quic) => {
	return quic && quic.contracts && quic.contracts.wethPrice
}

export const getQuicPriceContract = (quic) => {
	return quic && quic.contracts && quic.contracts.quicPrice
}

export const getMasterChefContract = (quic) => {
	return quic && quic.contracts && quic.contracts.masterChef
}
export const getQuicContract = (quic) => {
	return quic && quic.contracts && quic.contracts.quic
}

export const getFarms = (quic) => {
	return quic
		? quic.contracts.pools.map(
				({
					pid,
					name,
					symbol,
					icon,
					tokenAddress,
					tokenDecimals,
					tokenSymbol,
					tokenContract,
					lpAddress,
					lpContract,
					refUrl,
					poolType,
				}) => ({
					pid,
					id: symbol,
					name,
					lpToken: symbol,
					lpTokenAddress: lpAddress,
					lpContract,
					tokenAddress,
					tokenDecimals,
					tokenSymbol,
					tokenContract,
					earnToken: 'QUIC',
					earnTokenAddress: quic.contracts.quic.options.address,
					icon,
					refUrl,
					poolType,
				}),
		  )
		: []
}

export const getPoolWeight = async (masterChefContract, pid) => {
	const [{ allocPoint }, totalAllocPoint] = await Promise.all([
		masterChefContract.methods.poolInfo(pid).call(),
		masterChefContract.methods.totalAllocPoint().call(),
	])

	return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterChefContract, pid, account) => {
	return masterChefContract.methods.pendingReward(pid, account).call()
}

export const getLockedEarned = async (quicContract, account) => {
	return quicContract.methods.lockOf(account).call()
}

export const getTotalLPWethValue = async (
	masterChefContract,
	wethContract,
	lpContract,
	tokenContract,
	tokenDecimals,
	pid,
) => {
	const [
		tokenAmountWholeLP,
		balance,
		totalSupply,
		lpContractWeth,
		poolWeight,
	] = await Promise.all([
		tokenContract.methods.balanceOf(lpContract.options.address).call(),
		lpContract.methods.balanceOf(masterChefContract.options.address).call(),
		lpContract.methods.totalSupply().call(),
		wethContract.methods.balanceOf(lpContract.options.address).call(),
		getPoolWeight(masterChefContract, pid),
	])

	// Return p1 * w1 * 2
	const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
	const lpWethWorth = new BigNumber(lpContractWeth)
	const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
	// Calculate
	const tokenAmount = new BigNumber(tokenAmountWholeLP)
		.times(portionLp)
		.div(new BigNumber(10).pow(tokenDecimals))

	const wethAmount = new BigNumber(lpContractWeth)
		.times(portionLp)
		.div(new BigNumber(10).pow(18))
	return {
		tokenAmount,
		wethAmount,
		totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
		tokenPriceInWeth: wethAmount.div(tokenAmount),
		poolWeight: poolWeight,
	}
}

export const approve = async (lpContract, masterChefContract, account) => {
	return lpContract.methods
		.approve(masterChefContract.options.address, ethers.constants.MaxUint256)
		.send({ from: account })
}

export const stake = async (masterChefContract, pid, amount, account, ref) => {
	return masterChefContract.methods
		.deposit(pid, ethers.utils.parseUnits(amount, 18), ref)
		.send({ from: account })
		.on('transactionHash', (tx) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const unstake = async (
	masterChefContract,
	pid,
	amount,
	account,
	ref,
) => {
	return masterChefContract.methods
		.withdraw(pid, ethers.utils.parseUnits(amount, 18), ref)
		.send({ from: account })
		.on('transactionHash', (tx) => {
			console.log(tx)
			return tx.transactionHash
		})
}
export const harvest = async (masterChefContract, pid, account) => {
	return masterChefContract.methods
		.claimReward(pid)
		.send({ from: account })
		.on('transactionHash', (tx) => {
			console.log(tx)
			return tx.transactionHash
		})
}

export const getStaked = async (masterChefContract, pid, account) => {
	try {
		const { amount } = await masterChefContract.methods
			.userInfo(pid, account)
			.call()
		return new BigNumber(amount)
	} catch {
		return new BigNumber(0)
	}
}

export const getWethPrice = async (quic) => {
	console.log("utils.js getWethPrice")
	const amount = await quic.contracts.wethPrice.methods.latestAnswer().call()
	console.log("Got Weth price " + amount)
	return new BigNumber(amount)
}

export const getQuicPrice = async (quic) => {
	const addr = quic.quicAddress
	console.log("utils.js getQuicPrice")

	const amount = await quic.contracts.quicPrice.methods
		.consult(addr.toString(), 1)
		.call()
	return new BigNumber(amount)
}

export const getQuicSupply = async (quic) => {
	return new BigNumber(await quic.contracts.quic.methods.totalSupply().call())
}

export const getReferrals = async (masterChefContract, account) => {
	return await masterChefContract.methods.getGlobalRefAmount(account).call()
}

export function getRefUrl() {
	var refer = '0x0000000000000000000000000000000000000000'
	const urlParams = new URLSearchParams(window.location.search)
	if (urlParams.has('ref')) {
		refer = urlParams.get('ref')
	}
	console.log(refer)

	return refer
}

export const redeem = async (masterChefContract, account) => {
	let now = new Date().getTime() / 1000
	if (now >= 1597172400) {
		return masterChefContract.methods
			.exit()
			.send({ from: account })
			.on('transactionHash', (tx) => {
				console.log(tx)
				return tx.transactionHash
			})
	} else {
		alert('pool not active')
	}
}

export const runSetup = async (masterChefContract, account) => {
	return await masterChefContract.methods.setup().send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
		return tx.transactionHash
	})
}

export const addPair = async (masterChefContract, account, weight, lpAddress, updatePools) => {
	return await masterChefContract.methods.add(weight, lpAddress, false).send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
		return tx.transactionHash
	})
}

export const setPair = async (masterChefContract, account, pid, weight, updatePools) => {
	return await masterChefContract.methods.set(pid, weight, updatePools).send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
		return tx.transactionHash
	})
}

export const rewardUpdate = async (masterChefContract, account, amount) => {
	return await masterChefContract.methods.rewardUpdate(amount).send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
		return tx.transactionHash
	})
}

export const addAuthorized = async (masterChefContract, quic, account, authorizedAddress) => {
	await quic.methods.addAuthorized(authorizedAddress).send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
	})
	return await masterChefContract.methods.addAuthorized(authorizedAddress).send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
		return tx.transactionHash
	})
}

export const transferOwnership = async (quic, account, recipient) => {
	return await quic.methods.transferOwnership(recipient).send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
		return tx.transactionHash
	})
}

export const mint = async (quic, account, recipient, amount) => {
	return await quic.methods.mint(recipient, amount ).send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
		return tx.transactionHash
	})
}

export const capUpdate = async (quic, account, amount) => {
	return await quic.methods.capUpdate(amount).send({ from: account })
	.on('transactionHash', (tx) => {
		console.log(tx)
		return tx.transactionHash
	})
}

export const getCap = async (quic) => {
	return new BigNumber(await quic.contracts.quic.methods.cap().call())
}