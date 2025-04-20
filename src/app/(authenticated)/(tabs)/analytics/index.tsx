import { View, Text } from 'react-native'
import React, { useMemo } from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'
import HeaderAnalytics from '@/src/components/analytics/HeaderAnalytics'
import AnalyticsChart from '@/src/components/analytics/AnalyticsChart'
import HistoryContainer from '@/src/components/analytics/HistoryContainer'
import { ScrollView } from 'react-native-gesture-handler'
import { useGetFoldersWithItems } from '@/src/api/folder'
import { useGetTransaction } from '@/src/api/transaction'
import { useSyncUserRoles } from '@/src/hooks/useSyncUserRoles'
import Loading from '@/src/components/Loading'
import { useFolderMembersMap } from '@/src/api/users'
import ModalExport from '@/src/components/ModalExport'
import { useModal } from '@/src/providers/ModalProvider'

const AnalyticsScreen = () => {
	const { data: folders = [], isLoading } = useGetFoldersWithItems()
	const [activeIndex, setActiveIndex] = React.useState<number>(-1)
	const { handleOpenExport } = useModal()
	const folders_id = useMemo(() => folders!.map(folder => folder.id), [folders])

	const folderMap = useMemo(() => {
		return folders!.reduce((acc, folder) => {
			acc[folder.id] = folder
			return acc
		}, {} as Record<number, (typeof folders)[0]>)
	}, [folders])

	React.useEffect(() => {
		if (folders_id.length > 0 && activeIndex === -1) {
			setActiveIndex(folders_id[0])
		}
	}, [folders_id])

	const activeFolder = folderMap[activeIndex]
	useSyncUserRoles(activeFolder as any)

	const { data: transaction, isLoading: isTransLoading } =
		useGetTransaction(activeIndex)
	const { data: membersMap } = useFolderMembersMap(activeIndex)

	const totalChanges = useMemo(() => {
		if (!transaction)
			return { quantityChange: 0, priceChange: 0, userStats: {} }

		let quantityChange = 0
		let priceChange = 0
		const userStats: Record<string, number> = {}

		transaction.info.forEach(t => {
			quantityChange += t.changed_item?.quantity - t.prev_item?.quantity || 0
			priceChange += t.changed_item?.price - t.prev_item?.price || 0
			if (t.user_id) {
				userStats[t.user_id] = (userStats[t.user_id] || 0) + 1
			}
		})

		return {
			quantityChange,
			priceChange,
			userStats,
		}
	}, [transaction])

	if (isLoading || isTransLoading) {
		return <Loading />
	}

	return (
		<Container isPadding={false} container_style='mx-'>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Analytics',
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
				}}
			/>
			{transaction && transaction.info.length > 0 ? (
				<ScrollView className='flex-1 mt-2'>
					<HeaderAnalytics
						activeIndex={activeIndex}
						setActiveIndex={setActiveIndex}
						folders_id={folders_id}
						folderMap={folderMap}
					/>

					{/* Chart */}
					<AnalyticsChart transaction={transaction.info} />

					{/* Mini Dashboard */}
					<View className='bg-black-600 mx-3 p-4 rounded-xl my-2 mt-4'>
						<Text className='text-white font-lexend_semibold text-lg mb-3'>
							Mini Dashboard
						</Text>
						<View className='flex-row justify-between mb-2'>
							<Text className='text-gray font-lexend_medium'>
								Total Quantity Change:
							</Text>
							<Text className='text-white font-lexend_medium'>
								{totalChanges.quantityChange}
							</Text>
						</View>
						<View className='flex-row justify-between'>
							<Text className='text-gray font-lexend_medium'>
								Total Price Change:
							</Text>
							<Text className='text-white font-lexend_medium'>
								{totalChanges.priceChange.toFixed(2)}
							</Text>
						</View>
					</View>

					{/* User stats */}
					<View className='bg-black-600 mx-3 p-4 rounded-xl mt-3'>
						<Text className='text-white font-lexend_semibold text-lg mb-3'>
							Changes by Users
						</Text>
						{Object.entries(totalChanges.userStats)
							.sort((a, b) => b[1] - a[1])
							.map(([userId, count]) => (
								<View key={userId} className='flex-row justify-between mb-1'>
									<Text className='text-white'>
										{membersMap?.get(userId) || userId}
									</Text>
									<Text className='text-gray'>{count} change(s)</Text>
								</View>
							))}
					</View>

					<View className='w-full mt-2'>
						<HistoryContainer
							transaction={transaction.info}
							activeIndex={activeIndex}
							folderMap={folderMap}
							onExport={handleOpenExport}
						/>
					</View>
				</ScrollView>
			) : (
				<View className='flex-1 mt-2 items-center px-2'>
					<HeaderAnalytics
						activeIndex={activeIndex}
						setActiveIndex={setActiveIndex}
						folders_id={folders_id}
						folderMap={folderMap}
					/>
					<View className='mt-24'>
						<Text className='font-lexend_semibold text-[24px] text-white text-center'>
							No transactions found
						</Text>
						<Text className='font-lexend_light text-[16px] text-white text-center'>
							In the "Home" tab, you can create a folder and add items
						</Text>
					</View>
				</View>
			)}
			<ModalExport folderId={activeIndex} />
		</Container>
	)
}

export default AnalyticsScreen
