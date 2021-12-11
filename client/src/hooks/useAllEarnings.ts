import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterChefContract, getFarms } from '../quic/utils'
import useQuic from './useQuic'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const quic = useQuic()
  const farms = getFarms(quic)
  const masterChefContract = getMasterChefContract(quic)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(masterChefContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, masterChefContract, quic])

  useEffect(() => {
    if (account && masterChefContract && quic) {
      fetchAllBalances()
    }
  }, [account, block, masterChefContract, setBalance, quic])

  return balances
}

export default useAllEarnings
