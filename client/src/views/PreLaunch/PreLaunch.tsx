import React from 'react'
import styled from 'styled-components'
import quicBanner from '../../assets/img/quic-banner.png'
import quicLogo from '../../assets/img/quic.png'
import Button from '../../components/Button'
import Container from '../../components/Container'
import Page from '../../components/Page'
import PageHeader from '../../components/PageHeader'
import Spacer from '../../components/Spacer'
import Countdown from 'react-countdown'
import type { CountdownRenderProps } from 'react-countdown'


const PreLaunch: React.FC = () => {

	const renderer = (countdownProps: CountdownRenderProps) => {
		const { days , hours, minutes, seconds } = countdownProps
		const paddedSeconds = seconds < 10 ? `0${seconds}` : seconds
		const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes
		const paddedHours = hours < 10 ? `0${hours}` : hours
		return (
			<span style={{ width: '100%' }}>
				{days} Days  {paddedHours}:{paddedMinutes}:{paddedSeconds}
			</span>
		)
	}

	return (
		<Page>
			<PageHeader
				icon={quicLogo}
				title="its like Bao but Quicker"
				subtitle="Stake Sushiswap and Uniswap LP tokens to earn QUIC!"
			/>
			<StyledInfo>
				Be sure to read <a href="https://docs.quic.finance">docs.quic.finance</a>{' '}
				before using the pools so you are familiar with protocol risks and
				fees!
			</StyledInfo>
			<Spacer size="md" />
			<StyledInfo>
				Please note this is the mainnet version of Quic Finance
			</StyledInfo>
			<Spacer size="md" />

			<Spacer size="lg" />
			<StyledInfo>
				Launching in<Countdown
									date={1619892000000}
									renderer={renderer}
								/>
			</StyledInfo>
		</Page>
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

export default PreLaunch
