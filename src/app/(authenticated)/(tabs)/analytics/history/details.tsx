import { View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import Container from '@/src/components/Container'
import { itemType } from '@/src/types/types'
import TransactionDifference from '@/src/components/analytics/TransactionDifference'
import CustomButton from '@/src/components/CustomButton'
import { useGetTransaction } from '@/src/api/transaction'
import { useGetFoldersWithItems } from '@/src/api/folder'
import { useAccount } from '@/src/providers/AccountProvider'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { useSupabase } from '@/src/providers/SupabaseProvider'
import { useGetWarehouseUsers } from '@/src/api/users'
import Loading from '@/src/components/Loading'

dayjs.extend(utc)
dayjs.extend(timezone)
const HistoryDetailed = () => {
	const { id: idString, folder_id: folderIdString } = useLocalSearchParams()
	const router = useRouter()
	const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0])
	const folder_id = parseFloat(
		typeof folderIdString === 'string' ? folderIdString : folderIdString?.[0]
	)

	const { data: transactionData, isLoading: isTransactionsLoading } = useGetTransaction(folder_id)
	const transaction = transactionData?.info.find(t => t.id === id)

	const { data: folders = [] } = useGetFoldersWithItems()
	const folder = folders.find(f => f.id === folder_id)
	// const member = folder?.members.find(m => m.id === transaction?.user_id)
  const { data: warehouseUsers = [], isLoading:isUserLoading } = useGetWarehouseUsers(folder_id)
  const member = warehouseUsers.find(m => m.id === transaction?.user_id)
  

	const findDifferences = (
		prev_item: Partial<itemType[]>,
		changed_item: Partial<itemType[]>
	) => {
		const differences: Record<string, { prev: any; changed: any }> = {}
		Object.keys(prev_item || {}).forEach((key: any) => {
			const prevVal = prev_item?.[key]
			const changedVal = changed_item?.[key]
			if (JSON.stringify(prevVal) !== JSON.stringify(changedVal)) {
				differences[key] = { prev: prevVal, changed: changedVal }
			}
		})
		return differences
	}

	const differences = transaction
		? findDifferences(transaction.prev_item, transaction.changed_item)
		: {}


	const { revertItemToPreviousState } = useSupabase()

const handleRevertChanges = async () => {
  if (!transaction?.id || !folder_id) return

  const success = await revertItemToPreviousState!(transaction.id, folder_id)
  if (success) router.back()
}

	if (isTransactionsLoading || isUserLoading) {
		return (
      <Loading/>
		)
	}


	return (
		<Container isPadding={false} container_style='mx-2 pt-2'>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'History',
					headerTitleAlign: 'center',
					headerStyle: { backgroundColor: '#242121' },
					headerTintColor: '#fff',
				}}
			/>
			<ScrollView contentContainerStyle={{ gap: 10 }}>
				<View className='flex-col'>
					<TransactionDifference
						first_text='Full name:'
						second_text={member?.fullName || ''}
					/>
					<TransactionDifference
						first_text='Item:'
						second_text={transaction?.changed_item?.name || ''}
					/>
					<TransactionDifference
						first_text='Action:'
						second_text={
							transaction?.isCreated
								? 'Created'
								: transaction?.isEdited
								? 'Edited'
								: transaction?.isDeleted
								? 'Deleted'
								: transaction?.isReverted
								? 'Reverted'
								: 'Unknown'
						}
						containerStyle='mb-4'
					/>
					{Object.entries(differences).map(([key, value]) => (
						<View key={key} className='mb-2'>
							<TransactionDifference
								first_text={`Prev. ${
									key.charAt(0).toUpperCase() + key.slice(1)
								}:`}
								second_text={value.prev}
							/>
							<TransactionDifference
								first_text={`New ${
									key.charAt(0).toUpperCase() + key.slice(1)
								}:`}
								second_text={key === 'image_url' ? 'images' : value.changed}
							/>
						</View>
					))}
					<TransactionDifference
						first_text='Time:'
						second_text={
							transaction?.date
								? dayjs.utc(transaction.date).local().format('HH:mm:ss')
								: 'now'
						}
					/>
					<TransactionDifference
						first_text='Date:'
						second_text={
							transaction?.date
								? dayjs.utc(transaction.date).local().format('YYYY-MM-DD')
								: 'now'
						}
					/>
				</View>
			</ScrollView>
			<CustomButton
				text='Revert Changes'
				onClick={handleRevertChanges}
				styleContainer='mb-4'
			/>
		</Container>
	)
}

export default HistoryDetailed
