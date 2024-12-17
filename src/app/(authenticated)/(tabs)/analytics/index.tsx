import { View, Text } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'
import HeaderAnalytics from '@/src/components/analytics/SliderFolders'
import AnalyticsChart from '@/src/components/analytics/AnalyticsChart'
import HistoryContainer from '@/src/components/analytics/HistoryContainer'

const AnalyticsScreen = () => {
	const { transactions, folders } = useAccount()
	const folders_id = transactions.map(transaction => transaction.folder_id)
	const [activeIndex, setActiveIndex] = React.useState(folders_id[0])

	return (
		<Container isPadding={false} container_style=''>
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
			{transactions.length === 0 ? (
				<View className='flex-1 justify-center items-center px-2'>
					<Text className='font-lexend_semibold text-[24px] text-white text-center'>
						No transactions found
					</Text>
					<Text className='font-lexend_light text-[16px] text-white text-center'>
						In the "Home" tab, you can create a folder and add items
					</Text>
				</View>
			) : folders_id ? (
				<View className='flex-1 mt-2'>
					<HeaderAnalytics
						activeIndex={activeIndex}
						setActiveIndex={setActiveIndex}
						folders_id={folders_id}
					/>

					<AnalyticsChart folder_id={activeIndex} />

					<View className='w-full'>
						<HistoryContainer />
					</View>
				</View>
			) : (
				<View className='flex-1 justify-center items-center'>
					<Text className='font-lexend_semibold text-[24px]'>
						No folders found
					</Text>
					<Text className='font-lexend_light text-[16px]'>
						In the "Home" tab, you can create a folder
					</Text>
				</View>
			)}
		</Container>
	)
}

export default AnalyticsScreen
