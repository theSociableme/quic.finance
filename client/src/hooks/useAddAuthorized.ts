import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useQuic from './useQuic'
import BigNumber from 'bignumber.js'
import { addAuthorized, getQuicContract, getMasterChefContract } from '../quic/utils'

const useAddAuthorized = () => {

  const { account } = useWallet()
  const quic = useQuic()
	const quicContract = getQuicContract(quic)
  const masterChefContract = getMasterChefContract(quic)

  const handleAddAuthorized = useCallback(
    async (recipient: string) => {
      console.log("Adding " + recipient + " as Authorized Address")  
      const txHash = await addAuthorized(masterChefContract, quicContract, account, recipient)
      console.log(txHash)
      return txHash
    }, [masterChefContract, quicContract])

  return { onAddAuthorized: handleAddAuthorized}
}

export default useAddAuthorized
