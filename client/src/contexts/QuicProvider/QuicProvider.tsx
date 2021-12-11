import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Quic } from '../../quic'

export interface QuicContext {
	quic?: typeof Quic
}

export const Context = createContext<QuicContext>({
	quic: undefined,
})

declare global {
	interface Window {
		quicsauce: any
		quic: any
	}
}

const QuicProvider: React.FC = ({ children }) => {
	const { ethereum }: { ethereum: any } = useWallet()
	const [quic, setQuic] = useState<any>()

	window.quic = quic

	useEffect(() => {
		console.log('QuicProvider::useEffect')
		if (ethereum) {
			const chainId = Number(ethereum.chainId)
			console.log('chainId ' + chainId)
			const quicLib = new Quic(ethereum, chainId, false, {
				defaultAccount: ethereum.selectedAddress,
				defaultConfirmations: 1,
				autoGasMultiplier: 1.05,
				testing: false,
				defaultGas: '300000',
				defaultGasPrice: '20000000000',
				accounts: [],
				ethereumNodeTimeout: 10000,
			})
			console.log(quicLib)
			setQuic(quicLib)
			window.quicsauce = quicLib
		}
	}, [ethereum])

	return <Context.Provider value={{ quic }}>{children}</Context.Provider>
}

export default QuicProvider
