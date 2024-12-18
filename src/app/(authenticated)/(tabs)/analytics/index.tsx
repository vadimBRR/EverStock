import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'
import HeaderAnalytics from '@/src/components/analytics/HeaderAnalytics'
import AnalyticsChart from '@/src/components/analytics/AnalyticsChart'
import HistoryContainer from '@/src/components/analytics/HistoryContainer'
import { ScrollView } from 'react-native-gesture-handler'

const AnalyticsScreen = () => {
	const { transactions, folders } = useAccount()
  const [folders_id, setFolders_id] = React.useState(transactions.length
    ? transactions.map(transaction => transaction.folder_id)
    : [])
	const [activeIndex, setActiveIndex] = React.useState(folders_id[0])
	const [transaction, setTransaction] = React.useState(
		transactions.find(transaction => transaction.folder_id === activeIndex)
	)

  useEffect(() => {
    console.log("rerender");
    setFolders_id(transactions.length
      ? transactions.map(transaction => transaction.folder_id)
      : [])

    setTransaction(transactions.find(transaction => transaction.folder_id === activeIndex))


  }, [transactions])

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
			{transaction ? (
				<>
					{transaction.info.length === 0 ? (
						<View className='flex-1 justify-center items-center px-2'>
							<Text className='font-lexend_semibold text-[24px] text-white text-center'>
								No transactions found
							</Text>
							<Text className='font-lexend_light text-[16px] text-white text-center'>
								In the "Home" tab, you can create a folder and add items
							</Text>
						</View>
					) : folders_id.length!== 0 ? (
						<ScrollView className='flex-1 mt-2'>
							<HeaderAnalytics
								activeIndex={activeIndex}
								setActiveIndex={setActiveIndex}
								folders_id={folders_id}
							/>

							<AnalyticsChart folder_id={activeIndex} />

							<View className='w-full mt-2'>
								<HistoryContainer
									transaction={transaction}
									activeIndex={activeIndex}
								/>
							</View>
						</ScrollView>
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
				</>
			) : (
				<View className='flex-1 justify-center items-center px-2'>
					<Text className='font-lexend_semibold text-[24px] text-white text-center'>
						No folders found :(
					</Text>
					<Text className='font-lexend_light text-[16px] text-white text-center'>
						In the "Home" tab, you can create a folder
					</Text>
				</View>
			)}
		</Container>
	)
}

export default AnalyticsScreen
