import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useQuic from './useQuic'
import BigNumber from 'bignumber.js'
import { capUpdate, getQuicContract } from '../quic/utils'

const useCapUpdate = () => {

  const { account } = useWallet()
  const quic = useQuic()
	const quicContract = getQuicContract(quic)

  const handleCapUpdate = useCallback(
    async (amount: string) => {
      console.log("Updating the Cap to " + amount)  
      const txHash = await capUpdate(quicContract, account, new BigNumber(parseInt(amount)))
      console.log(txHash)
      return txHash
    }, [quicContract])

  return { onCapUpdate: handleCapUpdate}
}

export default useCapUpdate
