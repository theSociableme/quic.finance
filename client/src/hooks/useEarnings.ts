import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract } from '../quic/utils'
import useQuic from './useQuic'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const quic = useQuic()
  const masterChefContract = getMasterChefContract(quic)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(masterChefContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, masterChefContract, quic])

  useEffect(() => {
    if (account && masterChefContract && quic) {
      fetchBalance()
    }
  }, [account, block, masterChefContract, setBalance, quic])

  return balance
}

export default useEarnings
