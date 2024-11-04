import { View, Text, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useGetFoldersWithItems } from '@/src/api/folder'
import Loading from '@/src/components/Loading'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import { useModal } from '@/src/providers/ModalProvider'
import TotalInfo from '@/src/components/home/item/TotalInfo'
import { Tables } from '@/src/types/types'
import ModalCreate from '@/src/components/ModalCreate'
import CardItem from '@/src/components/home/item/CardItem'

export default function FolderScreen() {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	const [search, setSearch] = useState('')
	const [refreshing, setRefreshing] = useState(false)

	const handleSearch = (value: string) => {
		setSearch(value)
	}
	const { handleOpen } = useModal()

	if (!id) {
		;<View className='flex-1 justify-center items-center'>
			<Text className='font-bold'>Failed to fetch</Text>
		</View>
	}
	const { data, isLoading, refetch } = useGetFoldersWithItems()
	if (isLoading) return <Loading />
	const folder = data?.find(folder => folder.id === id)
	const items: Tables<'items'>[] | [] = folder?.items || []

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await refetch()
		setRefreshing(false)
	}, [refetch])

	if (!folder) return <Text>Folder not found</Text>


	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: folder.name,
					headerTitleAlign: 'center',
				}}
			/>
			<View className='flex-row w-full justify-center my-2 '>
				<SearchBar
					containerStyle='mr-2'
					search={search}
					handleSearch={handleSearch}
				/>
				<AddButton handlePressAdd={handleOpen} />
			</View>
			<TotalInfo
				totalMembers={folder.totalMembers}
				totalPrice={folder.totalPrice}
				totalQuantity={folder.totalQuantity}
				currencyFolder={folder.currency}
			/>


			<FlatList
				className='mx-3'
				data={items}
				keyExtractor={item => item.id.toString()}
				renderItem={({ item }) => (
					<CardItem
						item={item}
						currencyName={folder.currency || 'USD'}
						key={item.id}
					/>
				)}
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			/>
			<ModalCreate folderId={folder.id} />
		</Container>
	)
}
