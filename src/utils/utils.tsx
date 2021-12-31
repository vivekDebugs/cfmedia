export const getTimePassed = (d1: Date, d2: Date): string => {
	const diffInTime = d2.getTime() - d1.getTime()
	const diffInDays = Math.floor(diffInTime / (1000 * 60 * 60 * 24))
	const diffInHours = Math.floor(diffInTime / (1000 * 60 * 60))
	const diffInMinutes = Math.floor(diffInTime / (1000 * 60))
	const diffInSeconds = Math.floor(diffInTime / 1000)

	let timePassed
	if (diffInDays < 1) {
		if (diffInHours < 1) {
			if (diffInMinutes < 1) {
				timePassed = `${diffInSeconds}s`
			} else timePassed = `${diffInMinutes}m`
		} else timePassed = `${diffInHours}h`
	} else timePassed = `${diffInDays}d`

	return timePassed
}

// d1 < d2

export const convertToReadableDate = (d: Date): string => {
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	]
	const date = d.getDate()
	const month = months[d.getMonth()]
	const year = d.getFullYear()

	return `${month} ${date}, ${year}`
}

const URL_REGEX =
	/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/

export const renderText = (txt: string) =>
	txt.split(' ').map((part, idx) =>
		URL_REGEX.test(part) ? (
			<a
				href={part}
				target='_blank'
				rel='noreferrer'
				key={idx}
				onClick={e => e.stopPropagation()}
				style={{ textDecoration: 'none' }}
			>
				{part}
			</a>
		) : (
			part + ' '
		)
	)

export const getRandomInt = () => Math.floor(Math.random() * 1000000)
