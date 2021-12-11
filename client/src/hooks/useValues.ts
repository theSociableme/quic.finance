import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import { BigNumber } from 'bignumber.js'
import { useWallet } from 'use-wallet'

import {
  getWethPrice,
  getQuicPrice,
  getWethPriceContract,
  getQuicPriceContract,
} from '../quic/utils'
import useLockedEarnings from './useLockedEarnings'
import useQuic from './useQuic'
import useBlock from './useBlock'
import { Console } from 'node:console'

const useValues = () => {
  const { account }: { account: string } = useWallet()
  const quic = useQuic()
  const locks = useLockedEarnings()
  //const wethPriceContract = getWethPriceContract(quic)
  //const quicPriceContract = getQuicPriceContract(quic)
  const [usrText, setUsrText] = useState(new String())
  const [quicPrices, setQuicPrices] = useState(new BigNumber(0))
  const [wethPrices, setWethPrices] = useState(new BigNumber(0))

  const getInfo = useCallback(async () => {
    console.log("useValues getInfo")
    if (quic) {
      const wethPriceFun = getWethPrice(quic).then((response) => {
        setWethPrices(response)

        const quicPriceFun = getQuicPrice(quic).then((response) => {
          setQuicPrices(response)
          console.log('quicvalues')
          console.log(response)
          const currentRate = wethPrices
            .dividedBy(100000000)
            .dividedBy(quicPrices)
          const userValue = currentRate.multipliedBy(
            locks.dividedBy(1000000000000000000),
          )
          const dailyPrice = userValue.dividedBy(1095).toFormat(2)
          console.log(dailyPrice + ' dailyPrice')
          console.log(wethPrices + ' wethprice')
          console.log(quicPrices + ' quicPrice')
          const annualPrice = userValue.dividedBy(3).toFormat(2)
          console.log(annualPrice + ' annual')
          const wethText = userValue.toFormat(2)
          const usrText1 = 'Your Locked QUIC is worth approximately $' + wethText + ''
          setUsrText(usrText1)
          console.log(usrText)
        })
      })
    }
  }, [locks, usrText])

  useEffect(() => {
    if (account && quic) {
      getInfo()
    }
  }, [account, quic, locks, usrText])

  return usrText.toString()
}

export default useValues
