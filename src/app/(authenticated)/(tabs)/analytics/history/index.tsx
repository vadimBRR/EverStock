import { View, Text } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Container from '@/src/components/Container'
import { useAccount } from '@/src/providers/AccountProvider'
import {
	FlatList,
	ScrollView,
	TouchableOpacity,
} from 'react-native-gesture-handler'
import TransactionCard from '@/src/components/analytics/TransactionCard'
import { Ionicons } from '@expo/vector-icons'
import SearchBar from '@/src/components/SearchBar'

const HistoryScreen = () => {
	const { activeIndex: idString } = useLocalSearchParams()
	const router = useRouter()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	console.log('id', idString)

	const { getUserFullName, getAction, transactionSettings, folders } =
		useAccount()
	const folder = folders.find(folder => folder.id === id)
	const transaction = useAccount().transactions.find(
		transaction => transaction.folder_id === id
	)
	const [search, setSearch] = useState('')
	const handleSearch = (value: string) => {
		setSearch(value)
	}
	const filteredTransactions = useMemo(() => {
    const { sortBy, isAsc, membersId, itemsId, actions } = transactionSettings;
  
    let new_transaction;
    const transactions = [...(transaction?.info || [])];
  
    if (sortBy === 'member name') {
      new_transaction = transactions.sort((a, b) => {
        const memberA = folder?.members.find(member => member.id === a.user_id);
        const memberB = folder?.members.find(member => member.id === b.user_id);
  
        if (!memberA || !memberB) return 0;
  
        const fullNameA = memberA.fullName ?? '';
        const fullNameB = memberB.fullName ?? '';
  
        return isAsc
          ? fullNameA.localeCompare(fullNameB)
          : fullNameB.localeCompare(fullNameA);
      });
    }
  
    if (sortBy === 'item name') {
      new_transaction = transactions.sort((a, b) => {
        const itemA = a.prev_item;
        const itemB = b.prev_item;
  
        if (!itemA || !itemB) return 0;
  
        const nameA = itemA.name ?? '';
        const nameB = itemB.name ?? '';
  
        return isAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      });
    }
  
    if (sortBy === 'last updated') {
      new_transaction = transactions.sort((a, b) => {
        return isAsc
          ? a.date.localeCompare(b.date)
          : b.date.localeCompare(a.date);
      });
    }
  
    let filtered = new_transaction
      ? new_transaction
          .filter(item => (membersId?.length ? membersId.includes(item.user_id) : true))
          .filter(item => (itemsId?.length ? itemsId.includes(item.item_id) : true))
          .filter(item => {
            if (actions.isCreated && item.isCreated) return true;
            if (actions.isEdited && item.isEdited) return true;
            if (actions.isDeleted && item.isDeleted) return true;
  
            return !actions.isCreated && !actions.isEdited && !actions.isDeleted;
          })
      : [];
  
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(item => {
        const member = folder?.members.find(member => member.id === item.user_id);
        const itemName = item.prev_item?.name ?? '';
        const fullName = member?.fullName ?? '';
  
        return (
          fullName.toLowerCase().includes(searchLower) ||
          itemName.toLowerCase().includes(searchLower) ||
          item.date.toLowerCase().includes(searchLower)
        );
      });
    }
  
    return filtered;
  }, [transaction, transactionSettings, folder, search]);
  

	const handleOpenViewSettings = () => {
		router.push('/(authenticated)/(tabs)/analytics/history/settings?id=' + id)
		// router.setParams({ id })
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
							onPress={() => handleOpenViewSettings()}
						>
							<Ionicons name='options-outline' size={24} color='white' />
						</TouchableOpacity>
					),
				}}
			/>
			{/* <View className='flex-1 justify-center items-center px-2'>
            <Text className='font-lexend_semibold text-[24px] text-white text-center'>
              No transactions found
            </Text>
            <Text className='font-lexend_light text-[16px] text-white text-center'>
              In the "Home" tab, you can create a folder and add items
            </Text>
          </View>
           */}
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
						<TouchableOpacity onPress={() => {router.push(`/(authenticated)/(tabs)/analytics/history/details?id=${item.id}&folder_id=${id}`)}}>
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
