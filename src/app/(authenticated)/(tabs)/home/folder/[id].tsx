import { View, Text,  FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
// import { useGetFoldersWithItems } from '@/src/api/folder'
import Loading from '@/src/components/Loading'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import { useModal } from '@/src/providers/ModalProvider'
import TotalInfo from '@/src/components/home/item/TotalInfo'
import ModalCreate from '@/src/components/ModalCreate'
import CardItem from '@/src/components/home/item/CardItem'
import { folderType } from '@/src/types/types'
import { useAccount } from '@/src/providers/AccountProvider'
import * as SystemUI from 'expo-system-ui'

export default function FolderScreen() {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
  SystemUI.setBackgroundColorAsync("#1C1A1A")

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

  const folder = useAccount().folders.find(folder => folder.id === id)
  if (!folder) return <Text>Folder not found</Text>
  const items = useAccount().items.filter(item => item.folder_id === id)
	// const { data, isLoading, ♠refetch } = useGetFoldersWithItems()
  // const {data, setData} = useState<folder([])  

	// if (isLoading) return <Loading />
	// const folder = data?.find(folder => folder.id === id)
	// const items: Tables<'items'>[] | [] = folder?.items || []
  // console.log(items);

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		// await refetch()
		setRefreshing(false)
	}, [])

	// if (!folder) return <Text>Folder not found</Text>
  


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


			<FlatList
				className='mx-3 mb-24 '
				data={search ? items.filter(item => item.name.toLowerCase().includes(search.toLowerCase())) : items}
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
			<ModalCreate folderId={folder.id} />
		</Container>
	)
}
