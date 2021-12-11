import React from 'react'
import quicBanner from '../../assets/img/quic-banner.png'

interface QuicIconProps {
	size?: number
	v1?: boolean
	v2?: boolean
	v3?: boolean
}

const QuicIcon: React.FC<QuicIconProps> = ({ size = 36, v1, v2, v3 }) => (
	<span
		role="img"
		style={{
			fontSize: size,
			filter: v1 ? 'saturate(0.5)' : undefined,
		}}
	>
		<img src={quicBanner} width={71} height={50} />
	</span>
)

export default QuicIcon
