import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import React from 'react'
import TotalInfo from '../home/item/TotalInfo'

type Props = {
	activeIndex: number
	setActiveIndex: React.Dispatch<React.SetStateAction<number>>
	folders_id: number[]
	folderMap: Record<number, any>
}

const HeaderAnalytics = ({
	activeIndex,
	setActiveIndex,
	folders_id,
	folderMap,
}: Props) => {
	const currentFolder = folderMap[activeIndex]

	return (
		<View className='flex flex-col w-full '>
			<FlatList
				data={folders_id}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 5 }}
				style={{ marginBottom: 15, marginLeft: 10, marginRight: 10 }}
				renderItem={({ item }) => (
					<TouchableOpacity
						onPress={() => setActiveIndex(item)}
						className={`rounded-2xl border ${
							activeIndex === item ? 'bg-main_light' : 'border-white'
						} mr-1 p-2 px-4`}
					>
						<Text className='font-lexend_light text-lg text-white'>
							{folderMap[item]?.name || 'Unnamed'}
						</Text>
					</TouchableOpacity>
				)}
			/>
			<TotalInfo
				currencyFolder={
					currentFolder?.currency ? currentFolder.currency.toUpperCase() : 'USD'
				}
				totalQuantity={currentFolder?.totalQuantity || 0}
				totalPrice={currentFolder?.totalPrice || 0}
				totalMembers={currentFolder?.totalMembers || 0}
			/>
		</View>
	)
}

export default HeaderAnalytics
