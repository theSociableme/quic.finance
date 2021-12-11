import { useCallback } from 'react'

import useQuic from './useQuic'
import { useWallet } from 'use-wallet'

import { harvest, getMasterChefContract } from '../quic/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const quic = useQuic()
  const masterChefContract = getMasterChefContract(quic)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterChefContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, quic])

  return { onReward: handleReward }
}

export default useReward
