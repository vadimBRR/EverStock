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
import { Ionicons } from '@expo/vector-icons'
import { useGetFoldersWithItems } from '@/src/api/folder'
import Loading from '@/src/components/Loading'
import { Tables } from '@/src/types/types'
import { useSyncUserRoles } from '@/src/hooks/useSyncUserRoles'
import { useRolesStore } from '@/src/store/useUserRoles'
import { useAccount } from '@/src/providers/AccountProvider'
import { useIsFocused } from '@react-navigation/native'

export default function FolderScreen() {
  const isFocused = useIsFocused()

	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	const [search, setSearch] = useState('')
	const [refreshing, setRefreshing] = useState(false)
	const { handleOpenCreate } = useModal()

	const { data, isLoading, isError, refetch } = useGetFoldersWithItems()
	const { viewSettings } = useAccount()
	const folder = useMemo(
		() => data?.find((folder: Tables<'folders'>) => folder.id === id),
		[data, id]
	)

	useSyncUserRoles(folder as any)

	const roles = useRolesStore(state => state.roles)
	console.log(roles)
	const canAdd = roles?.isAddItem === true

	const items = (folder?.items || []) as Tables<'items'>[]

	const handleSearch = (value: string) => setSearch(value)
	const handleOpenViewSettings = () => {
		router.push('/(authenticated)/(tabs)/home/item/settings')
	}
	const handleOpenFastEdit = () => {
		router.push('/(authenticated)/(tabs)/home/folder/fast_edit/' + id)
	}

	const onRefresh = useCallback(async () => {
		setRefreshing(true)
		await refetch()
		setRefreshing(false)
	}, [refetch])

	const sortedItems = useMemo(() => {
		const filtered = items.filter(
			(item: Tables<'items'>) =>
				!search || item.name.toLowerCase().includes(search.toLowerCase())
		)

		const { sortBy, isAsc } = viewSettings

		return filtered
			.filter(item => {
				const passesSearch =
					!search || item.name.toLowerCase().includes(search.toLowerCase())
				const passesLowStock =
					!viewSettings.viewOptions.lowStockOnly ||
					(item.min_quantity && item.quantity! < item.min_quantity)
				return passesSearch && passesLowStock
			})
			.sort((a, b) => {
				let aValue: any
				let bValue: any

				switch (sortBy) {
					case 'name':
						aValue = a.name.toLowerCase()
						bValue = b.name.toLowerCase()
						break
					case 'quantity':
						aValue = a.quantity
						bValue = b.quantity
						break
					case 'price':
						aValue = a.price
						bValue = b.price
						break
					case 'total price':
						aValue = a.price! * a.quantity!
						bValue = b.price! * b.quantity!
						break
					case 'last updated':
						aValue = new Date(a.updated_at || a.created_at || 0).getTime()
						bValue = new Date(b.updated_at || b.created_at || 0).getTime()
						break
					default:
						aValue = a.name.toLowerCase()
						bValue = b.name.toLowerCase()
				}

				if (aValue < bValue) return isAsc ? -1 : 1
				if (aValue > bValue) return isAsc ? 1 : -1
				return 0
			})
	}, [items, search, viewSettings])


  if (!isFocused) return null

	if (isLoading) return <Loading />
	if (isError)
		return (
			<Text className='text-white text-center mt-4'>Failed to load data</Text>
		)
	if (!folder)
		return <Text className='text-white text-center mt-4'>Folder not found</Text>

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: folder.name,
					headerTitleAlign: 'center',
					headerStyle: { backgroundColor: '#242121' },
					headerTintColor: '#fff',
          contentStyle: {
            backgroundColor: '#1C1A1A',
          },
					headerRight: () => (
						<View className='flex flex-row'>
							{canAdd && (
								<TouchableOpacity
									className='flex-row items-center p-2'
									onPress={handleOpenFastEdit}
								>
									<Ionicons name='hammer-outline' size={24} color='white' />
								</TouchableOpacity>
							)}
							<TouchableOpacity
								className='flex-row items-center p-2'
								onPress={handleOpenViewSettings}
							>
								<Ionicons name='options-outline' size={24} color='white' />
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			<View className='flex-row w-full justify-center my-2'>
				<SearchBar
					containerStyle='mr-2'
					search={search}
					handleSearch={handleSearch}
				/>
				<AddButton handlePressAdd={handleOpenCreate} disabled={canAdd} />
			</View>
			<TotalInfo
				totalMembers={folder.totalMembers}
				totalPrice={folder.totalPrice}
				totalQuantity={folder.totalQuantity}
				currencyFolder={folder.currency || 'USD'}
			/>
			{sortedItems.length === 0 ? (
				<View className='flex-1 justify-center items-center px-2'>
					<Text className='font-lexend_semibold text-[24px] text-white text-center'>
						No items found :(
					</Text>
					<Text className='font-lexend_light text-[16px] text-white text-center'>
						Click on the + button at the top to add item or clear the search
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
							currencyName={folder.currency || 'USD'}
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
