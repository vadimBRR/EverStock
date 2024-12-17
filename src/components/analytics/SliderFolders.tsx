import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import { useAccount } from '@/src/providers/AccountProvider'
import TotalInfo from '../home/item/TotalInfo'

type Props = {
	activeIndex: number
	setActiveIndex: React.Dispatch<React.SetStateAction<number>>
	folders_id: number[]
}
const HeaderAnalytics = ({
	activeIndex,
	setActiveIndex,
	folders_id,
}: Props) => {
	const { folders } = useAccount()
	if (!folders_id) return null
	return (
		<View className='flex flex-col w-full '>
			<FlatList
				data={folders_id}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 10 }}
        style={{marginBottom: 15, marginLeft: 10, marginRight: 10}}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						onPress={() => setActiveIndex(item)}
						className={`rounded-full border  ${
							activeIndex === item ? 'bg-main_light' : 'border-white'
						} mr-1 p-2 px-4`}
					>
						<Text className='font-lexend_light text-lg text-white'>
							{folders[index].name}
						</Text>
					</TouchableOpacity>
				)}
			/>
      <TotalInfo currencyFolder={folders[activeIndex].currency.name} totalQuantity={folders[activeIndex].totalQuantity} totalPrice={folders[activeIndex].totalPrice} totalMembers={folders[activeIndex].totalMembers}/>
		</View>
	)
}

export default HeaderAnalytics
