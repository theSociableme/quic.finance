import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import Button from '../../../components/Button'
import Modal, { ModalProps } from '../../../components/Modal'
import ModalActions from '../../../components/ModalActions'
import ModalTitle from '../../../components/ModalTitle'

import styled from 'styled-components'
import Input, { InputProps } from '../../../components/Input'


interface AddAuthorizedModalProps extends ModalProps {
	onConfirm: (address: string) => void
}

const AddAuthorizedModal: React.FC<AddAuthorizedModalProps> = ({
	onConfirm,
	onDismiss,
}) => {
	const [recipientAddress, setRecipientAddress] = useState('')
	const [pendingTx, setPendingTx] = useState(false)

	const handleAddressChange = useCallback(
		(e: React.FormEvent<HTMLInputElement>) => {
			console.log("Setting recipient address to " + e.currentTarget.value)
			setRecipientAddress(e.currentTarget.value)
			console.log("Value of recipient address to " + recipientAddress)
		},
		[setRecipientAddress],
	)

	return (
		<Modal>
			<ModalTitle text={`Add Authorized Address`} />
			<Input 
				endAdornment={
					<StyledTokenAdornmentWrapper>
						<StyledTokenSymbol>Address </StyledTokenSymbol>
						<StyledSpacer />
		
					</StyledTokenAdornmentWrapper>
				}
				onChange={handleAddressChange}
				value={recipientAddress}/>
			<ModalActions>
				<Button text="Cancel" variant="secondary" onClick={onDismiss} />
				<Button
					disabled={pendingTx}
					text={pendingTx ? 'Pending Confirmation' : 'Confirm'}
					onClick={async () => {
						setPendingTx(true)
						await onConfirm(recipientAddress)
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

export default AddAuthorizedModal
