import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useQuic from './useQuic'
import BigNumber from 'bignumber.js'
import { setPair, getMasterChefContract } from '../quic/utils'

const useSetPair = () => {

  const { account } = useWallet()
  const quic = useQuic()
  const masterChefContract = getMasterChefContract(quic)


  const handleSetPair = useCallback(
    async (pid: string, weight: string, updatePools: string) => {
      let boolUpdatePools = updatePools === 'true'
      console.log("Updating Pid" + pid + " with weight:" + weight + "and update Pools set to " + boolUpdatePools)  
      const txHash = await setPair(masterChefContract, account, new BigNumber(parseInt(pid)), new BigNumber(parseInt(weight)), updatePools)
      console.log(txHash)
      return txHash
    }, [masterChefContract])

  return { onSetPair: handleSetPair}
}

export default useSetPair
