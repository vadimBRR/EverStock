import { View, Text } from 'react-native'
import React from 'react'
import dayjs from 'dayjs'

const TransactionCard = ({
	fullName,
	action,
	date,
	containerStyle,
}: {
	fullName: string
	action: string
	date: string
	containerStyle?: string
}) => {
	const fontSizeClass =
		action.length > 40
			? 'text-sm'
			: action.length > 32
			? 'text-base'
			: 'text-lg'
	const displayedAction =
		action.length > 39 ? `${action.slice(0, 37)}...` : action

	return (
		<View className={`bg-black-700 px-3 py-1 ${containerStyle}`}>
			<View className='flex flex-row justify-between'>
				<Text className='text-gray font-poppins_light text-sm'>{fullName}</Text>
				<Text className='text-gray font-poppins_light text-sm'>
					{dayjs.utc(date).local().format('DD.MM.YYYY')}
				</Text>
			</View>
			<View className='flex-row justify-between items-center'>
				<Text
					className={`text-white font-poppins_light flex-1 ${fontSizeClass}`}
				>
					{displayedAction}
				</Text>
				<Text className='text-white font-poppins_light text-sm text-right w-[80px]'>
					{dayjs.utc(date).local().format('HH:mm:ss')}
				</Text>
			</View>
		</View>
	)
}

export default TransactionCard
