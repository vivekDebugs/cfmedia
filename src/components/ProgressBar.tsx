import React from 'react'

interface IProps {
	progress: number
}

const ProgressBar: React.FC<IProps> = ({ progress }) => {
	const barStyle = {
		height: '.25rem',
		width: '100%',
		backgroundColor: 'whitesmoke',
		borderRadius: 40,
	}

	const progressStyle = {
		height: '100%',
		width: `${progress}%`,
		backgroundColor: '#999999',
		borderRadius: 40,
	}

	return (
		<div style={barStyle}>
			<div style={progressStyle}></div>
		</div>
	)
}

export default ProgressBar
