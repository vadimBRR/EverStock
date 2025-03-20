import React, { useCallback, useMemo, useState, useEffect } from 'react'
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
import { useModal } from '@/src/providers/ModalProvider'
import { useAccount } from '@/src/providers/AccountProvider'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import CardItemFastEdit from '@/src/components/home/item/CardItemFastEdit'
import { itemType } from '@/src/types/types'

export default function FastEditScreen() {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

	const { handleUpdateItem, items, viewSettings, folders } = useAccount()
	const { handleOpenCreate } = useModal()

	const [search, setSearch] = useState('')
	const [refreshing, setRefreshing] = useState(false)
	const [activeItemId, setActiveItemId] = useState<number | null>(null)
	const [prevActiveItemId, setPrevActiveItemId] = useState<number | null>(null)
	const [editedQuantities, setEditedQuantities] = useState<Record<number, number>>({})

	const handleSearch = (value: string) => {
		setSearch(value)
	}

	const folder = folders.find(folder => folder.id === id)
	if (!folder) return <Text>Folder not found</Text>

	const folderItems = items.filter(item => item.folder_id === id)

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		setRefreshing(false)
	}, [])

	const handleBack = () => {

    Object.entries(editedQuantities).forEach(([id, quantity]) => {
      const item = items.find(item => item.id === parseInt(id))
      if (item) {
        handleSaveItem({ item, quantity })
      }
    })
    
		router.back()
	}

	// Автозбереження кількості при зміні активної картки
	useEffect(() => {
		if (prevActiveItemId !== null && prevActiveItemId !== activeItemId) {
			if (editedQuantities[prevActiveItemId] !== undefined) {
				handleSaveItem({
					item: items.find(item => item.id === prevActiveItemId)!,
					quantity: editedQuantities[prevActiveItemId],
				})
			}
		}
		setPrevActiveItemId(activeItemId)
	}, [activeItemId])

	const handleQuantityChange = (id: number, quantity: number) => {
		setEditedQuantities(prev => ({ ...prev, [id]: quantity }))
	}

	const handleSaveItem = ({ item, quantity }: { item: itemType; quantity: number }) => {
		handleUpdateItem({ ...item, quantity })
	}

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
						currencyName={folder.currency.name || 'USD'}
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
