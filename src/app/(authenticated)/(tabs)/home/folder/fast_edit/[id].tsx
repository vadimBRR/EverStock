import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
	View,
	Text,
	FlatList,
	RefreshControl,
	TouchableOpacity,
} from 'react-native'
import { router, Stack, useLocalSearchParams } from 'expo-router'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import CardItemFastEdit from '@/src/components/home/item/CardItemFastEdit'
import Loading from '@/src/components/Loading'
import { itemType, Tables } from '@/src/types/types'
import { useGetFoldersWithItems } from '@/src/api/folder' 
import { useUpdateItem } from '@/src/api/item' 

export default function FastEditScreen() {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

	const { data: folders = [], isLoading, refetch } = useGetFoldersWithItems()
	const updateItem = useUpdateItem()

	const [search, setSearch] = useState('')
	const [refreshing, setRefreshing] = useState(false)
	const [activeItemId, setActiveItemId] = useState<number | null>(null)
	const [prevActiveItemId, setPrevActiveItemId] = useState<number | null>(null)
	const [editedQuantities, setEditedQuantities] = useState<Record<number, number>>({})

	const folder = useMemo(() => folders!.find(f => f.id === id), [folders, id])
	const folderItems = useMemo(() => {
		if (!folder) return []
		const items = folder.items || []
		return search
			? items.filter(item => item.name.toLowerCase().includes(search.toLowerCase()))
			: items
	}, [folder, search])

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await refetch()
		setRefreshing(false)
	}, [refetch])

	const handleSearch = (value: string) => {
		setSearch(value)
	}

	const handleBack = () => {
		Object.entries(editedQuantities).forEach(([itemIdStr, quantity]) => {
			const item = folderItems.find(i => i.id === parseInt(itemIdStr))
			if (item) {
				handleSaveItem({ item, quantity })
			}
		})
		router.back()
	}

	const handleQuantityChange = (id: number, quantity: number) => {
		setEditedQuantities(prev => ({ ...prev, [id]: quantity }))
	}

	const handleSaveItem = ({ item, quantity }: { item: Tables<'items'>; quantity: number }) => {
		if (!item || quantity < 0) return
		updateItem.mutate({
			updatedItem: { ...item, quantity },
			previousItem: item,
		})
	}

	useEffect(() => {
		if (prevActiveItemId !== null && prevActiveItemId !== activeItemId) {
			const quantity = editedQuantities[prevActiveItemId]
			if (quantity !== undefined) {
				const item = folderItems.find(i => i.id === prevActiveItemId)
				if (item) {
					handleSaveItem({ item, quantity })
				}
			}
		}
		setPrevActiveItemId(activeItemId)
	}, [activeItemId])

	if (isLoading) return <Loading />
	if (!folder) return <Text className='text-white text-center mt-10'>Folder not found</Text>

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: folder.name,
					headerTitleAlign: 'center',
					headerStyle: { backgroundColor: '#242121' },
					headerTintColor: '#fff',
					headerRight: () => (
						<View className='flex flex-row'>
							<TouchableOpacity className='flex-row items-center p-2' onPress={handleBack}>
								<MaterialIcons name='done-outline' size={24} color='white' />
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			<View className='w-full items-center my-2 relative'>
				<SearchBar containerStyle='w-[95%]' search={search} handleSearch={handleSearch} />
			</View>

			<FlatList
				className='mx-3'
				data={folderItems}
				keyExtractor={item => item.id.toString()}
				extraData={activeItemId}
				renderItem={({ item }) => (
					<CardItemFastEdit
						item={item}
						currencyName={folder.currency || 'USD'}
						activeItemId={activeItemId}
						setActiveItemId={setActiveItemId}
						handleQuantityChange={handleQuantityChange}
						handleSaveItem={handleSaveItem}
					/>
				)}
				refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
			/>
		</Container>
	)
}
