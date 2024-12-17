import { View, Text } from 'react-native'
import React from 'react'
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

const HistoryScreen = () => {
	const { activeIndex: idString } = useLocalSearchParams()
  const router = useRouter();
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	console.log('id', idString)

	const { getUserFullName, getAction } = useAccount()
	const transaction = useAccount().transactions.find(
		transaction => transaction.folder_id === id
	)

  const handleOpenViewSettings = () => {
    router.push('/(authenticated)/(tabs)/analytics/history/settings')
    // router.setParams({ id })
  }
	return (
		<Container isPadding={false} container_style='mx-4 pt-4'>
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
            <TouchableOpacity className='flex-row items-center p-2' onPress={() => handleOpenViewSettings()}>
              <Ionicons name='options-outline' size={24} color='white' />
            </TouchableOpacity>
          )
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
			<ScrollView showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>

				<FlatList
					data={transaction?.info.sort((a, b) => b.date.localeCompare(a.date))}
					scrollEnabled={false}
					contentContainerStyle={{ gap: 10 }}
					renderItem={({ item, index }) => (
						<TouchableOpacity onPress={() => {}}>
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
