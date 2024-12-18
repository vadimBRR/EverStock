import { View, Text, Image } from 'react-native'
import React from 'react'
import { currency } from '@/src/constants'

type Props = {
	totalMembers: number
	totalPrice: number
	totalQuantity: number
	currencyFolder: string | null
}
export default function TotalInfo({
	totalMembers,
	totalPrice,
	totalQuantity,
	currencyFolder,
}: Props) {
	return (
		<View className='flex-row  justify-between mx-3 bg-black-800 p-2 px-6 rounded-xl border border-black/10 mb-2'>
			<View className='flex-row  items-center'>
				<Image
					source={require('@/src/assets/icons/stats/quantity_dark.png')}
					className='w-6 h-6 aspect-square'
				/>
				<Text className='font-lexend_regular text-gray text-xl ml-1'>
					{totalQuantity}
				</Text>
			</View>
			<View className='flex-row items-center'>
				<Text className='font-lexend_regular text-gray text-xl'>
					{currency.find(c => c.name === currencyFolder)?.value}
					{totalPrice}
				</Text>
			</View>
			<View className='flex-row items-center  '>
				<Image
					source={require('@/src/assets/icons/stats/members_dark.png')}
					className='w-[22px] h-[22px] aspect-square'
				/>
				<Text className='font-lexend_regular text-gray text-xl ml-1'>
					{totalMembers}
				</Text>
			</View>
		</View>
	)
}
