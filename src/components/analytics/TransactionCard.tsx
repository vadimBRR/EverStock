import { View, Text } from 'react-native'
import React from 'react'
import { formatDuration } from '@/src/scripts'

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
	return (
		<View className={` bg-black-700 px-3 py-1 ${containerStyle}`}>
			<Text className='text-gray font-poppins_light text-base'>{fullName}</Text>
			<View className='flex-row justify-between items-center'>
				<Text className='text-white font-poppins_light text-lg'>{action}</Text>
				<Text className='text-white font-poppins_light '>
					{formatDuration(date)}
				</Text>
			</View>
		</View>
	)
}

export default TransactionCard
