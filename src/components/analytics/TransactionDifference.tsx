import { View, Text } from 'react-native'
import React from 'react'

const TransactionDifference = ({
	first_text,
	second_text,
	containerStyle = '',
	isImage = false,
	textStyle = '',
}: {
	first_text: string
	second_text: string
	containerStyle?: string
	isImage?: boolean
	textStyle?: string
}) => {
	return (
		<View
			className={`bg-black-600 p-3 px-4 rounded-xl flex-row justify-between mb-2 items-center ${containerStyle}`}
		>
			<Text className='text-white font-lexend_semibold text-lg'>
				{first_text}
			</Text>

			<Text className={`text-white font-lexend_light text-lg ${textStyle}`}>
				{second_text}
			</Text>
		</View>
	)
}

export default TransactionDifference
