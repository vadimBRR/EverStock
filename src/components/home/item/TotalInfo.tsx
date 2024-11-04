import { View, Text, Image, StyleSheet } from 'react-native'
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
			<View className='flex-row  justify-between mx-3 bg-white p-2 px-6 rounded-xl border border-black/10 mb-2' >
				<View className='flex-row  items-center'>
					<Image
						source={require('@/src/assets/icons/stats/quantity.png')}
						className='w-7 h-7 aspect-square'
					/>
					<Text className='font-lexend_regular text-black text-xl ml-1'>
						{totalQuantity}
					</Text>
				</View>
				<View className='flex-row items-center'>
					<Text className='font-lexend_regular text-black text-xl'>
						{currency.find(c => c.name === currencyFolder)?.value}
						{totalQuantity}
					</Text>
				</View>
				<View className='flex-row items-center  '>
					<Image
						source={require('@/src/assets/icons/stats/members.png')}
						className='w-[22px] h-[22px] aspect-square'
					/>
					<Text className='font-lexend_regular text-black text-xl ml-1'>
						{totalQuantity}
					</Text>
				</View>
			</View>
	)
}

const styles = StyleSheet.create({
  // shadowBox: {
    
  //   shadowColor: '#000000', 
  //   shadowOffset: {
  //     width: 0, 
  //     height: 1, 
  //   },
  //   shadowOpacity: 0.25, 
  //   shadowRadius: 4, 
  //   elevation: 4, 
  // },
});