import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useQuic from './useQuic'
import BigNumber from 'bignumber.js'
import { transferOwnership, getQuicContract } from '../quic/utils'

const useTransferOwnership = () => {

  const { account } = useWallet()
  const quic = useQuic()
	const quicContract = getQuicContract(quic)


  const handleTransferOwnership = useCallback(
    async (recipient: string) => {
      console.log("Transferring Ownership to " + recipient )  
      const txHash = await transferOwnership(quicContract, account, recipient)
      console.log(txHash)
      return txHash
    }, [quicContract])

  return { onTransferOwnership: handleTransferOwnership}
}

export default useTransferOwnership
