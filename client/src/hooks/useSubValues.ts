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

const useSubValues = () => {
  const { account }: { account: string } = useWallet()
  const quic = useQuic()
  const wethPriceContract = getWethPriceContract(quic)
  const quicPriceContract = getQuicPriceContract(quic)
  const locks = useLockedEarnings()
  const [usrSubText, setUsrSubText] = useState(new String())
  const [quicPrices, setQuicPrices] = useState(new BigNumber(0))
  const [wethPrices, setWethPrices] = useState(new BigNumber(0))

  const getInfo = useCallback(async () => {
    if (quic) {
      const wethPriceFun = getWethPrice(quic).then((response) => {
        setWethPrices(response)

        const quicPriceFun = getQuicPrice(quic).then((response) => {
          setQuicPrices(response)
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
          const usrSubText =
            'When this unlocks it will earn you $' +
            dailyPrice +
            ' per day for 2 years. The equivalent of $' +
            annualPrice +
            ' per year!'
          setUsrSubText(usrSubText)
        })
      })
    }
  }, [locks, usrSubText])

  useEffect(() => {
    if (account && quic) {
      getInfo()
    }
  }, [account, quic, locks, usrSubText])

  return usrSubText.toString()
}

export default useSubValues
