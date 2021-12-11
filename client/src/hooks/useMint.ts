import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useQuic from './useQuic'
import BigNumber from 'bignumber.js'
import { mint, getQuicContract } from '../quic/utils'

const useMint = () => {

  const { account } = useWallet()
  const quic = useQuic()
	const quicContract = getQuicContract(quic)

  const handleMint = useCallback(
    async (recipient: string, amount: string) => {
      console.log("Minting " + amount + " to " + recipient)  
      const txHash = await mint(quicContract, account, recipient, new BigNumber(parseInt(amount)))
      console.log(txHash)
      return txHash
    }, [quicContract])

  return { onMint: handleMint}
}

export default useMint
