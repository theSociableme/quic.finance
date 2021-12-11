import { useCallback, useEffect, useState } from 'react'

import { BigNumber } from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getMasterChefContract } from '../quic/utils'
import useQuic from './useQuic'
import useBlock from './useBlock'
import { ethers } from 'ethers'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const quic = useQuic()
  const masterChefContract = getMasterChefContract(quic)
  const block = useBlock()
  let userBalance

  const fetchBalance = useCallback(async () => {
    BigNumber.config({ DECIMAL_PLACES: 18 })
    const balance = await getStaked(masterChefContract, pid, account)
    userBalance = new BigNumber(balance)
    setBalance(userBalance.decimalPlaces(18))
  }, [account, pid, quic])

  useEffect(() => {
    if (account && quic) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, quic])

  return balance.decimalPlaces(18)
}

export default useStakedBalance
