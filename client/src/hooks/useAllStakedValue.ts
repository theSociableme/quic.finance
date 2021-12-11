import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getMasterChefContract,
  getWethContract,
  getFarms,
  getTotalLPWethValue,
} from '../quic/utils'
import useBao from './useQuic'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  wethAmount: BigNumber
  totalWethValue: BigNumber
  tokenPriceInWeth: BigNumber
  poolWeight: BigNumber
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const quic = useBao()
  const farms = getFarms(quic)
  const masterChefContract = getMasterChefContract(quic)
  const wethContract = getWethContract(quic)
  const block = useBlock()

  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.map(
        ({
          pid,
          lpContract,
          tokenContract,
          tokenDecimals,
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
          tokenDecimals: number
        }) =>
          getTotalLPWethValue(
            masterChefContract,
            wethContract,
            lpContract,
            tokenContract,
            tokenDecimals,
            pid,
          ),
      ),
    )

    setBalance(balances)
  }, [account, masterChefContract, quic])

  useEffect(() => {
    if (account && masterChefContract && quic) {
      fetchAllStakedValue()
    }
  }, [account, block, masterChefContract, setBalance, quic])

  return balances
}

export default useAllStakedValue
