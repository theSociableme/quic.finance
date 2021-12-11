import { useCallback } from 'react'

import useQuic from './useQuic'
import { useWallet } from 'use-wallet'

import { stake, getMasterChefContract, getRefUrl } from '../quic/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const quic = useQuic()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(
        getMasterChefContract(quic),
        pid,
        amount,
        account,
        getRefUrl(),
      )
      console.log(txHash)
    },
    [account, pid, quic],
  )

  return { onStake: handleStake }
}

export default useStake
