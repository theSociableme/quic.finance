import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useQuic from './useQuic'
import BigNumber from 'bignumber.js'
import { rewardUpdate, getQuicContract } from '../quic/utils'

const useRewardUpdate = () => {

  const { account } = useWallet()
  const quic = useQuic()
	const quicContract = getQuicContract(quic)

  const handleRewardUpdate = useCallback(
    async (amount: string) => {
      console.log("Updating the Cap to " + amount)  
      const txHash = await rewardUpdate(quicContract, account, new BigNumber(parseInt(amount)))
      console.log(txHash)
      return txHash
    }, [quicContract])

  return { onRewardUpdate: handleRewardUpdate}
}

export default useRewardUpdate
