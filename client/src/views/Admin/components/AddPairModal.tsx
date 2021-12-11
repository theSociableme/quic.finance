import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'

import styled from 'styled-components'
import Input, { InputProps } from '../../../components/Input'


interface AddPairModalProps extends ModalProps {
	onConfirm: (weight: string, lpAddress: string, updatePools: string) => void
}

const AddPairModal: React.FC<AddPairModalProps> = ({
	onConfirm,
	onDismiss,
}) => {
	const [updatePools, setUpdatePools] = useState('')
	const [weight, setWeight] = useState('')
	const [lpAddress, setLpAddress] = useState('')
	const [pendingTx, setPendingTx] = useState(false)

	const handleAmountChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			setWeight(e.currentTarget.value)
		},
		[setWeight],
	)

	const handleAddressChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			setLpAddress(e.currentTarget.value)
		},
		[setLpAddress],
	)

	const handleUpdatePoolsChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			setUpdatePools(e.currentTarget.value)
		},
		[setUpdatePools],
	)

	return (
		<Modal>
			<ModalTitle text={`Add LP Pool`} />
			<Input 
				endAdornment={
					<StyledTokenAdornmentWrapper>
						<StyledTokenSymbol>Weight </StyledTokenSymbol>
						<StyledSpacer />
		
					</StyledTokenAdornmentWrapper>
				}
				onChange={handleAmountChange}
				value={weight.toString()}/>
			<Input 
				endAdornment={
					<StyledTokenAdornmentWrapper>
						<StyledTokenSymbol>Address </StyledTokenSymbol>
						<StyledSpacer />
		
					</StyledTokenAdornmentWrapper>
				}
				onChange={handleAddressChange}
				value={lpAddress}/>
			<Input 
				endAdornment={
					<StyledTokenAdornmentWrapper>
						<StyledTokenSymbol>Update Pools </StyledTokenSymbol>
						<StyledSpacer />
		
					</StyledTokenAdornmentWrapper>
				}
				onChange={handleUpdatePoolsChange}
				value={updatePools}/>
			<ModalActions>
				<Button text="Cancel" variant="secondary" onClick={onDismiss} />
				<Button
					disabled={pendingTx}
					text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
					onClick={async () => {
						setPendingTx(true)
						await onConfirm(weight, lpAddress, updatePools)
						setPendingTx(false)
						onDismiss()
					}}
				/>
			</ModalActions>
		</Modal>
	)
}

const StyledTokenInput = styled.div``

const StyledSpacer = styled.div`
	width: ${(props) => props.theme.spacing[3]}px;
`

const StyledTokenAdornmentWrapper = styled.div`
	align-items: center;
	display: flex;
`

const StyledMaxText = styled.div`
	align-items: center;
	color: ${(props) => props.theme.color.grey[400]};
	display: flex;
	font-size: 14px;
	font-weight: 700;
	height: 44px;
	justify-content: flex-end;
`

const StyledTokenSymbol = styled.span`
	color: ${(props) => props.theme.color.grey[600]};
	font-weight: 700;
`

export default AddPairModal
