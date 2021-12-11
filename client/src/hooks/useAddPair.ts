import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useQuic from './useQuic'
import BigNumber from 'bignumber.js'
import { addPair, getMasterChefContract } from '../quic/utils'

const useAddPair = () => {

  const { account } = useWallet()
  const quic = useQuic()
  const masterChefContract = getMasterChefContract(quic)


  const handleAddPair = useCallback(
    async (weight: string, lpAddress: string, updatePools: string) => {
      let boolUpdatePools = updatePools === 'true'
      console.log("Adding " + lpAddress + " with weight:" + weight + " updatepools to " + boolUpdatePools)  
      const txHash = await addPair(masterChefContract, account, new BigNumber(parseInt(weight)), lpAddress, boolUpdatePools)
      console.log(txHash)
      return txHash
    }, [masterChefContract])

  return { onAddPair: handleAddPair}
}

export default useAddPair
