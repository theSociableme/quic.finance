import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import useQuic from './useQuic'

import { runSetup, getMasterChefContract } from '../quic/utils'

const useRunSetup = () => {
  const { account } = useWallet()
  const quic = useQuic()
  const masterChefContract = getMasterChefContract(quic)

  const handleRunSetup = useCallback(async () => {
    console.log("Running Setup with MasterChef at " + masterChefContract._address)  
    const txHash = await runSetup(masterChefContract, account)
    console.log(txHash)
    return txHash
  }, [masterChefContract])

  return { onRunSetup: handleRunSetup}
}

export default useRunSetup
