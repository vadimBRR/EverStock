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
  const folder = folders.find(folder => folder.id === activeIndex)

	return (
		<View className='flex flex-col w-full '>
			<FlatList
				data={folders_id}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 5 }}
				style={{ marginBottom: 15, marginLeft: 10, marginRight: 10 }}
				renderItem={({ item, index }) => (
					<TouchableOpacity
						onPress={() => setActiveIndex(item)}
						className={`rounded-2xl border  ${
							activeIndex === item ? 'bg-main_light' : 'border-white'
						} mr-1 p-2 px-4`}
					>
						<Text className='font-lexend_light text-lg text-white'>
							{folders[index].name}
						</Text>
					</TouchableOpacity>
				)}
			/>
			<TotalInfo
				currencyFolder={folder?.currency? folder.currency.name : 'USD'}
				totalQuantity={folder?.totalQuantity || 0}
				totalPrice={folder?.totalPrice|| 0}
				totalMembers={folder?.totalMembers|| 0}
			/>
		</View>
	)
}

export default HeaderAnalytics
