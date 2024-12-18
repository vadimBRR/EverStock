import { View } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { ScrollView } from 'react-native-gesture-handler'
import Container from '@/src/components/Container'
import { useAccount } from '@/src/providers/AccountProvider'
import { itemType } from '@/src/types/types'
import TransactionDifference from '@/src/components/analytics/TransactionDifference'
import CustomButton from '@/src/components/CustomButton'

const HistoryDetailed = () => {
	const { id: idString, folder_id: folderIdString } = useLocalSearchParams()
	const router = useRouter()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	const folder_id = parseFloat(
		folderIdString
			? typeof folderIdString === 'string'
				? folderIdString
				: folderIdString[0]
			: ''
	)

	const transaction = useAccount()
		.transactions.find(transaction => transaction.folder_id === folder_id)
		?.info.find(info => info.id === id)

	const findDifferences = (
		prev_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>,
		changed_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>
	): Partial<Record<keyof typeof prev_item, { prev: any; changed: any }>> => {
		const differences: Partial<
			Record<keyof typeof prev_item, { prev: any; changed: any }>
		> = {}

		;(Object.keys(prev_item) as (keyof typeof prev_item)[]).forEach(key => {
			if (
				JSON.stringify(prev_item[key]) !== JSON.stringify(changed_item[key])
			) {
				differences[key] = {
					prev: prev_item[key],
					changed: changed_item[key],
				}
			}
		})

		return differences
	}

	const differences = transaction
		? findDifferences(transaction.prev_item, transaction.changed_item)
		: {}

	const member = useAccount()
		.folders.find(folder => folder.id === folder_id)
		?.members.find(member => member.id === transaction?.user_id)

	const { handleUpdateItem } = useAccount()
	const handleRevertChanges = () => {
		handleUpdateItem({
			id: transaction?.changed_item?.id || 0,
			...transaction?.prev_item,
			quantity: transaction?.prev_item.amount ?? 0,
			name: transaction?.prev_item.name ?? '',
			price: transaction?.prev_item.price ?? 0,
			image_url: transaction?.prev_item.image_url ?? [],
			note: transaction?.prev_item.note ?? '',
			typeAmount: transaction?.prev_item.typeAmount ?? '',
			tag: transaction?.prev_item.tag ?? '',
      isReverted: true
		})

		router.push(`/(authenticated)/(tabs)/home/folder/${folder_id}`)
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
								: 'Deleted'
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
								second_text={key === 'image_url' ? 'images': value.changed}
							/>
						</View>
					))}
					<TransactionDifference
						first_text='Time:'
						second_text={
							transaction?.date
								? new Date(transaction?.date).toLocaleTimeString()
								: 'now'
						}
					/>
					<TransactionDifference
						first_text='Date:'
						second_text={
							transaction?.date
								? new Date(transaction?.date).toLocaleDateString()
								: 'now'
						}
					/>
				</View>
			</ScrollView>
			<CustomButton
				text='Revert Changes'
				onClick={() => {
					handleRevertChanges()
				}}
				styleContainer='mb-4'
			/>
		</Container>
	)
}

export default HistoryDetailed
