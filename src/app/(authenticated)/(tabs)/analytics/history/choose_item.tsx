import { View } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import {
	FlatList,
	ScrollView,
	TouchableOpacity,
} from 'react-native-gesture-handler'
import CustomButton from '@/src/components/CustomButton'
import CardItem from '@/src/components/home/item/CardItem'

const ChooseItemScreen = ({}) => {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	const router = useRouter()
	const members =
		useAccount().folders.find(folder => folder.id === id)?.members || []
	const items = useAccount().items.filter(item => item.folder_id === id)


	const { transactionSettings, handleUpdateTransactionSettings } = useAccount()
	const [choseItems, setChoseItems] = useState(transactionSettings.itemsId)

	const [search, setSearch] = useState('')
	const handleSearch = (value: string) => {
		setSearch(value)
	}

	const handleApply = () => {
		handleUpdateTransactionSettings({
			...transactionSettings,
			itemsId: choseItems,
		})
		router.back()
	}

	const toggleItems = (itemId: number) => {
		if (choseItems.includes(itemId)) {
			setChoseItems(choseItems.filter(id => id !== itemId))
		} else {
			setChoseItems([...choseItems, itemId])
		}
	}

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Choose member',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
				}}
			/>

			<View className='flex-1 mx-4 mt-2 mb-5'>
				<ScrollView>
					<SearchBar
						search={search}
						handleSearch={handleSearch}
						containerStyle='w-full mb-4'
					/>

					<FlatList
						scrollEnabled={false}
						className=' '
						data={
							search
								? items.filter(item =>
										item.name.toLowerCase().includes(search.toLowerCase())
								  )
								: items
						}
						keyExtractor={member => member.id.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity onPress={() => toggleItems(item.id)}>
								<CardItem
									item={item}
									currencyName={item.typeAmount}
									isPressable={false}
									containerStyle={`${
										choseItems.includes(item.id)
											? 'border-1 border-white  bg-dark_gray'
											: ''
									} `}
								/>
							
							</TouchableOpacity>
						)}
					/>
				</ScrollView>
				<CustomButton text='Apply' onClick={handleApply} />
			</View>
		</Container>
	)
}

export default ChooseItemScreen
