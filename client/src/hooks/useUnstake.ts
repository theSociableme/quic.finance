import { useCallback } from 'react'

import useQuic from './useQuic'
import { useWallet } from 'use-wallet'

import { unstake, getMasterChefContract, getRefUrl } from '../quic/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const quic = useQuic()
  const masterChefContract = getMasterChefContract(quic)

  const handleUnstake = useCallback(
    async (amount: string) => {
      console.log(getRefUrl())
      const txHash = await unstake(
        masterChefContract,
        pid,
        amount,
        account,
        getRefUrl(),
      )
      console.log(txHash)
    },
    [account, pid, quic],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
