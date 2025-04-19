import React, { useMemo, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Container from '@/src/components/Container'
import {
	FlatList,
	ScrollView,
	TouchableOpacity,
} from 'react-native-gesture-handler'
import TransactionCard from '@/src/components/analytics/TransactionCard'
import { Ionicons } from '@expo/vector-icons'
import SearchBar from '@/src/components/SearchBar'
import { useAccount } from '@/src/providers/AccountProvider'
import { useGetTransaction } from '@/src/api/transaction'
import { useGetFoldersWithItems } from '@/src/api/folder'

const HistoryScreen = () => {
	const { activeIndex: idString } = useLocalSearchParams()
	const router = useRouter()

	const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0])

	const { getUserFullName, getAction, transactionSettings } = useAccount()
	const { data: folders = [] } = useGetFoldersWithItems()
	const { data: transaction } = useGetTransaction(id)

	const folder = folders.find(folder => folder.id === id)
	const info = transaction?.info || []

	const [search, setSearch] = useState('')

	const handleSearch = (value: string) => {
		setSearch(value)
	}

	const filteredTransactions = useMemo(() => {
    const { sortBy, isAsc, membersId, itemsId, actions } = transactionSettings
    let result = [...info]
  
    // Сортування
    if (sortBy === 'member name') {
      result.sort((a, b) => {
        const nameA = getUserFullName({ user_id: a.user_id, activeIndex: id }) ?? ''
        const nameB = getUserFullName({ user_id: b.user_id, activeIndex: id }) ?? ''
        return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      })
    }
    if (sortBy === 'item name') {
      result.sort((a, b) => {
        const nameA = a.prev_item?.name ?? ''
        const nameB = b.prev_item?.name ?? ''
        return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA)
      })
    }
    if (sortBy === 'last updated') {
      result.sort((a, b) =>
        isAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)
      )
    }
  
    // 🔍 ФІЛЬТРАЦІЯ по вибраних member'ах та item'ах
    result = result
      .filter(t => (membersId?.length ? membersId.includes(t.user_id) : true))
      .filter(t => (itemsId?.length ? itemsId.includes(t.item_id) : true))
      .filter(t => {
        if (actions.isCreated && t.isCreated) return true
        if (actions.isEdited && t.isEdited) return true
        if (actions.isDeleted && t.isDeleted) return true
        if (actions.isReverted && t.isReverted) return true
        return (
          !actions.isCreated &&
          !actions.isEdited &&
          !actions.isDeleted &&
          !actions.isReverted
        )
      })
  
    // 🔍 ПОШУК тільки по item.name і user_id
    if (search) {
      const searchLower = search.toLowerCase()
      result = result.filter(t => {
        const itemName = t.prev_item?.name?.toLowerCase() || ''
        const userId = t.user_id.toLowerCase()
        return (
          itemName.includes(searchLower) ||
          userId.includes(searchLower)
        )
      })
    }
  
    return result
  }, [info, transactionSettings, id, search])
  

	const handleOpenViewSettings = () => {
		router.push('/(authenticated)/(tabs)/analytics/history/settings?id=' + id)
	}

	return (
		<Container isPadding={false} container_style='mx-2 pt-2'>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'History',
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
					headerRight: () => (
						<TouchableOpacity
							className='flex-row items-center p-2'
							onPress={handleOpenViewSettings}
						>
							<Ionicons name='options-outline' size={24} color='white' />
						</TouchableOpacity>
					),
				}}
			/>
			<ScrollView
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{ gap: 10 }}
			>
				<SearchBar
					containerStyle='w-full'
					search={search}
					handleSearch={handleSearch}
				/>
				<FlatList
					data={filteredTransactions}
					scrollEnabled={false}
					contentContainerStyle={{ gap: 10 }}
					renderItem={({ item, index }) => (
						<TouchableOpacity
							onPress={() =>
								router.push(
									`/(authenticated)/(tabs)/analytics/history/details?id=${item.id}&folder_id=${id}`
								)
							}
						>
							<TransactionCard
								key={index}
								fullName={getUserFullName({
									user_id: item.user_id,
									activeIndex: id,
								})}
								action={getAction(item)}
								date={item.date}
								containerStyle='rounded-xl'
							/>
						</TouchableOpacity>
					)}
					keyExtractor={(item, index) => index.toString()}
				/>
			</ScrollView>
		</Container>
	)
}

export default HistoryScreen
