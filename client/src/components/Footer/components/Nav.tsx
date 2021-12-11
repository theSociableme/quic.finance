import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
	return (
		<StyledNav>
			<StyledLink
				target="_blank"
				href="https://etherscan.io/address/0xBD530a1c060DC600b951f16dc656E4EA451d1A2D"
			>
				QuicChef Contract
			</StyledLink>
			<StyledLink
				target="_blank"
				href="https://app.uniswap.org/#/swap?inputCurrency=0xf0D7EE27DaC89D849D262ec175c553E801572Ab4&outputCurrency=ETH"
			>
				Uniswap QUIC-ETH
			</StyledLink>
			<StyledLink
				target="_blank"
				href="https://app.sushiswap.fi/pair/"
			>
				SushiSwap QUIC-ETH
			</StyledLink>
			<StyledLink target="_blank" href="https://discord.gg/RyeUuBma">
				Discord
			</StyledLink>
			<StyledLink target="_blank" href="https://twitter.com/quicfinance">
				Twitter
			</StyledLink>
			<StyledLink target="_blank" href="https://medium.com/@quicfinance">
				Medium
			</StyledLink>
		</StyledNav>
	)
}

const StyledNav = styled.nav`
	align-items: center;
	display: flex;
`

const StyledLink = styled.a`
	color: ${(props) => props.theme.color.grey[400]};
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	text-decoration: none;
	&:hover {
		color: ${(props) => props.theme.color.grey[500]};
	}
`

export default Nav
