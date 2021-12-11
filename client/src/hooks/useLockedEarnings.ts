import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getLockedEarned, getQuicContract } from '../quic/utils'
import useQuic from './useQuic'
import useBlock from './useBlock'

const useLockedEarnings = () => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const quic = useQuic()
  const quicContract = getQuicContract(quic)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getLockedEarned(quicContract, account)
    setBalance(new BigNumber(balance))
  }, [account, quicContract, quic])

  useEffect(() => {
    if (account && quicContract && quic) {
      fetchBalance()
    }
  }, [account, block, quicContract, setBalance, quic])

  return balance
}

export default useLockedEarnings
