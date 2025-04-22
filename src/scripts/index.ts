import dayjs, { Dayjs } from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export function formatDuration(
	start: string | Date,
	end: string | Dayjs = dayjs()
) {
	const startDate = dayjs(start)
	const endDate = dayjs(end)

	const diffInMilliseconds = endDate.diff(startDate)
	const formattedDuration = dayjs.duration(diffInMilliseconds)

	if (formattedDuration.asYears() >= 1) {
		return `${Math.floor(formattedDuration.asYears())}y`
	} else if (formattedDuration.asMonths() >= 1) {
		return `${Math.floor(formattedDuration.asMonths())}mo`
	} else if (formattedDuration.asDays() >= 1) {
		return `${Math.floor(formattedDuration.asDays())}d`
	} else if (formattedDuration.asHours() >= 1) {
		return `${Math.floor(formattedDuration.asHours())}h`
	} else if (formattedDuration.asMinutes() >= 1) {
		return `${Math.floor(formattedDuration.asMinutes())}m`
	} else {
		return `${Math.floor(formattedDuration.asSeconds())}s`
	}
}
