import {
	View,
	Text,
	FlatList,
	RefreshControl,
	TouchableOpacity,
} from 'react-native'
import React, { useCallback, useMemo, useState } from 'react'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import { useModal } from '@/src/providers/ModalProvider'
import TotalInfo from '@/src/components/home/item/TotalInfo'
import ModalCreate from '@/src/components/ModalCreate'
import CardItem from '@/src/components/home/item/CardItem'
import { itemType } from '@/src/types/types'
import { useAccount } from '@/src/providers/AccountProvider'
import * as SystemUI from 'expo-system-ui'
import { Ionicons } from '@expo/vector-icons'

export default function FolderScreen() {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	SystemUI.setBackgroundColorAsync('#1C1A1A')

	const [search, setSearch] = useState('')
	const [refreshing, setRefreshing] = useState(false)

	const handleSearch = (value: string) => {
		setSearch(value)
	}
	const { handleOpenCreate } = useModal()

	if (!id) {
		;<View className='flex-1 justify-center items-center'>
			<Text className='font-bold'>Failed to fetch</Text>
		</View>
	}
	const { viewSettings } = useAccount()
	const folder = useAccount().folders.find(folder => folder.id === id)
	if (!folder) return <Text>Folder not found</Text>
	const items = useAccount().items.filter(item => item.folder_id === id)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		// await refetch()
		setRefreshing(false)
	}, [])

	const handleOpenViewSettings = () => {
		router.push('/(authenticated)/(tabs)/home/item/settings')
	}

	const sortedItems = useMemo(() => {
		const sortBy = viewSettings.sortBy
		const sortByCorrect =
			sortBy === 'name'
				? 'name'
				: sortBy === 'quantity'
				? 'amount'
				: sortBy === 'price'
				? 'price'
				: sortBy === 'total price'
				? 'totalPrice'
				: sortBy === 'last updated'
				? 'created_at'
				: ''

		return items
			.filter(
				(item: itemType) =>
					!search || item.name.toLowerCase().includes(search.toLowerCase())
			)
			.sort((a: itemType, b: itemType) => {
				const field = sortByCorrect as keyof itemType
				const ascMultiplier = viewSettings.isAsc ? 1 : -1
				if (a[field] < b[field]) return -1 * ascMultiplier
				if (a[field] > b[field]) return 1 * ascMultiplier
				return 0
			})
	}, [items, search, viewSettings])

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: folder.name,
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
					headerRight: () => (
						<TouchableOpacity
							className='flex-row items-center p-2'
							onPress={() => handleOpenViewSettings()}
						>
							<Ionicons name='options-outline' size={24} color='white' />
						</TouchableOpacity>
					),
				}}
			/>
			<View className='flex-row w-full justify-center my-2'>
				<SearchBar
					containerStyle='mr-2'
					search={search}
					handleSearch={handleSearch}
				/>
				<AddButton handlePressAdd={handleOpenCreate} />
			</View>
			<TotalInfo
				totalMembers={folder.totalMembers}
				totalPrice={folder.totalPrice}
				totalQuantity={folder.totalQuantity}
				currencyFolder={folder.currency.name}
			/>
			{sortedItems.length === 0 ? (
				<View className='flex-1 justify-center items-center px-2'>
					<Text className='font-lexend_semibold text-[24px] text-white text-center'>
          No items found :(
					</Text>
					<Text className='font-lexend_light text-[16px] text-white text-center'>
          Click on the + button at the top to add item
					</Text>
				</View>
			) : (
				<FlatList
					className='mx-3 '
					data={sortedItems}
					keyExtractor={item => item.id.toString()}
					extraData={items}
					renderItem={({ item }) => (
						<CardItem
							item={item}
							currencyName={folder.currency.name || 'USD'}
							key={item.id}
						/>
					)}
					refreshControl={
						<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
					}
				/>
			)}

			<ModalCreate folderId={folder.id} />
		</Container>
	)
}
