import React, { useEffect, useCallback, useState, Fragment } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import WalletProviderModal from '../../components/WalletProviderModal'
import styled from 'styled-components'
import useModal from '../../hooks/useModal'
import Card from '../../components/Card'
import CardContent from '../../components/CardContent'
import Label from '../../components/Label'
import Spacer from '../../components/Spacer'
import QuicIcon from '../../components/QuicIcon'
import Value from '../../components/Value'
import BigNumber from 'bignumber.js'
import Button from '../../components/Button'
import Page from '../../components/Page'
import { getBalanceNumber } from '../../utils/formatBalance'

import { getQuicSupply, getMasterChefContract, getQuicContract, getCap } from '../../quic/utils'
import useQuic from '../../hooks/useQuic'
import useRunSetup from '../../hooks/useRunSetup'
import useMint from '../../hooks/useMint'
import useCapUpdate from '../../hooks/useCapUpdate'
import useRewardUpdate from '../../hooks/useRewardUpdate'
import useAddPair from '../../hooks/useAddPair'
import useSetPair from '../../hooks/useSetPair'
import useAddAuthorized from '../../hooks/useAddAuthorized'
import useTransferOwnership from '../../hooks/useTransferOwnership'

import MintModal from './components/MintModal'
import CapUpdateModal from './components/CapUpdateModal'
import RewardUpdateModal from './components/RewardUpdateModal'
import AddPairModal from './components/AddPairModal'
import SetPairModal from './components/SetPairModal'
import AddAuthorizedModal from './components/AddAuthorizedModal'
import TransferOwnershipModal from './components/TransferOwnershipModal'

const Admin: React.FC = () => {
	const [supplyCap, setSupplyCap] = useState<BigNumber>()
	const [totalSupply, setTotalSupply] = useState<BigNumber>()
	const { path } = useRouteMatch()
	const { account } = useWallet()
	const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)
    const quic = useQuic()

    const chef = getMasterChefContract(quic)
	const [pendingTx, setPendingTx] = useState(false)

    const { onRunSetup } = useRunSetup()
	const { onMint } = useMint()
	const { onCapUpdate } = useCapUpdate()
	const { onRewardUpdate } = useRewardUpdate()
	const { onAddPair } = useAddPair()
	const { onSetPair } = useSetPair()
	const { onAddAuthorized } = useAddAuthorized()
	const { onTransferOwnership } = useTransferOwnership()

    const [onPresentMint] = useModal(
		<MintModal
			onConfirm={onMint}
		/>,
	)

	const [onPresentCapUpdate] = useModal(
		<CapUpdateModal
			onConfirm={onCapUpdate}
		/>,
	)

	const [onPresentRewardUpdate] = useModal(
		<RewardUpdateModal
			onConfirm={onRewardUpdate}
		/>,
	)

	const [onPresentAddPair] = useModal(
		<AddPairModal
			onConfirm={onAddPair}
		/>,
	)

	const [onPresentSetPair] = useModal(
		<SetPairModal
			onConfirm={onSetPair}
		/>,
	)

	const [onPresentAddAuthorized] = useModal(
		<AddAuthorizedModal
			onConfirm={onAddAuthorized}
		/>,
	)

	const [onPresentTransferOwnership] = useModal(
		<TransferOwnershipModal
			onConfirm={onTransferOwnership}
		/>,
	)

	useEffect(() => {
		async function fetchSupplyCap() {
			const supply = await getCap(quic)
			setSupplyCap(supply)
		}
		if (quic) {
			fetchSupplyCap()
		}
	}, [quic, setSupplyCap])


	useEffect(() => {
		async function fetchTotalSupply() {
			const supply = await getQuicSupply(quic)
			setTotalSupply(supply)
		}
		if (quic) {
			fetchTotalSupply()
		}
	}, [quic, setTotalSupply])


	return (
		<Switch>
			<Page>
				{account && account ===  '0xf49eA18Ca30372d8A21D9Ee9e33B1fa7efb7AaE5' ? (
					<>  
					<Fragment>
						<StyledWrapper>
							<Card>
								<CardContent>
									<StyledBalances>
										<StyledBalance>
											<QuicIcon />
											<Spacer />
											<div style={{ flex: 1 }}>
												<Label text="Quic Supply Cap" />
												<Value
													value={supplyCap ? supplyCap.toNumber() : 'Locked'}
												/>
											</div>
										</StyledBalance>
									</StyledBalances>
								</CardContent>
							</Card>
							<Spacer />

							<Card>
								<CardContent>
									<Label text="Total QUIC Supply" />
									<Value
										value={totalSupply ? getBalanceNumber(totalSupply) : 'Locked'}
									/>
								</CardContent>
								<Footnote>
									New rewards per block
									<FootnoteValue>1000 QUIC</FootnoteValue>
								</Footnote>
							</Card>
						</StyledWrapper>
					</Fragment>
                        Hello Admin 
                        <div
                            style={{
                                alignItems: 'center',
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'center',
                            }}>

                            <Button
                            						text={pendingTx ? 'Setting up ......' : 'Run Setup'}
                                                    onClick={async () => {
                                                        setPendingTx(true)
                                                        await onRunSetup()
                                                        setPendingTx(false)
                                                    }}
                                                    />

                                
								<Button 
									text="Mint"
									onClick={onPresentMint}/>
								<br/>
								<Spacer size="lg" />
								<Button 
									text="Update Cap"
									onClick={onPresentCapUpdate}/>
								<Button 
									text="Update Reward"
									onClick={onPresentRewardUpdate}/>
											<Spacer size="lg" />
								<Button 
									text="Add Pair"
									onClick={onPresentAddPair}/>	
								<Button 
									text="Update Pair"
									onClick={onPresentSetPair}/>	
											<Spacer size="lg" />	
								<Button 
									text="Add Authorized"
									onClick={onPresentAddAuthorized}/>	
								<Button 
									text="Transfer Ownership of Quic Token"
									onClick={onPresentTransferOwnership}/>		
                        </div>
					</>
				) : (
					<div
						style={{
							alignItems: 'center',
							display: 'flex',
							flex: 1,
							justifyContent: 'center',
						}}
					>
						<Button
							onClick={onPresentWalletProviderModal}
							text="🔓 Unlock Wallet"
						/>
					</div>
				)}
			</Page>
		</Switch>

	)
}
const StyledInfo = styled.h3`
	color: ${(props) => props.theme.color.grey[500]};
	font-size: 16px;
	font-weight: 400;
	margin: 0;
	padding: 0;
	text-align: center;

	> b {
		color: ${(props) => props.theme.color.grey[600]};
	}
`

const Footnote = styled.div`
	font-size: 14px;
	padding: 8px 20px;
	color: ${(props) => props.theme.color.grey[400]};
	border-top: solid 1px ${(props) => props.theme.color.grey[300]};
`
const FootnoteValue = styled.div`
	font-family: 'Roboto Mono', monospace;
	float: right;
`

const StyledWrapper = styled.div`
	align-items: center;
	display: flex;
	@media (max-width: 768px) {
		width: 100%;
		flex-flow: column nowrap;
		align-items: stretch;
	}
`

const StyledBalances = styled.div`
	display: flex;
`

const StyledBalance = styled.div`
	align-items: center;
	display: flex;
	flex: 1;
`

const StyledActionSpacer = styled.div`
	height: ${(props) => props.theme.spacing[4]}px;
	width: ${(props) => props.theme.spacing[4]}px;
`

export default Admin