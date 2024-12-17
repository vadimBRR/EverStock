import React, { useState } from 'react'
import { useAccount } from '@/src/providers/AccountProvider'
import {
	Dimensions,
	View,
	Text,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import {
	FlatList,
	GestureHandlerRootView,
	PinchGestureHandler,
	ScrollView,
} from 'react-native-gesture-handler'

const AnalyticsChart = ({ folder_id }: { folder_id: number }) => {
	const { getChangesByField, transactions } = useAccount()
	const currentTransactions = transactions.filter(
		transaction => transaction.folder_id === folder_id
	)
	if (!currentTransactions.length)
		return (
			<View>
				<Text className='font-lexend_light text-white text-center'>
					No transactions in this folder
				</Text>
			</View>
		)

	const [filter, setFilter] = useState<'amount' | 'price'>('amount')
	const [timeRange, setTimeRange] = useState<
		'today' | '1_week' | '2_weeks' | '1_month' | 'all'
	>('all')

	const changes = getChangesByField(folder_id, filter, timeRange)

	const labels = changes.map(change => {
		const date = new Date(change.date)
		return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
	})

	const dataPoints = changes.map(change => {
		const value = change.value
		return isNaN(value) || !isFinite(value) ? 0 : value
	})

	const [chartWidth, setChartWidth] = useState(
		Math.max(Dimensions.get('window').width, dataPoints.length * 50)
	)
	const [selectedPoint, setSelectedPoint] = useState<{
		x: number
		y: number
		value: number
	} | null>(null)

	const handlePinch = (event: any) => {
		const scale = event.nativeEvent.scale || 1
		const newWidth = Math.max(
			Dimensions.get('window').width,
			chartWidth * scale
		)
		setChartWidth(newWidth)
	}

	return (
		<GestureHandlerRootView className='flex-1 bg-gray-900'>
			<View className='mx-4 mt-2'>
				<Text className='text-lg text-white font-lexend_semibold'>
					Inventory Changes
				</Text>
			</View>
			<View className='p-4 pt-2 pb-0'>
				<FlatList
					data={['all', 'today', '1_week', '2_weeks', '1_month']}
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ gap: 10 }}
					style={{ marginBottom: 15 }}
					renderItem={({ item }) => (
						<TouchableOpacity
							onPress={() =>
								setTimeRange(
									item as 'today' | '1_week' | '2_weeks' | '1_month' | 'all'
								)
							}
							className={`rounded-lg border  ${
								timeRange === item ? 'bg-main_light' : 'border-white'
							} p-2 px-4`}
						>
							<Text className='font-lexend_light text-white'>
								{item.replace('_', ' ')}
							</Text>
						</TouchableOpacity>
					)}
				/>


			</View>
				<View className='flex-row justify-between mb-4 w-full items-center  '>
					{['amount', 'price'].map(field => (
						<Text
							key={field}
							className={` py-2 rounded-lg text-white text-center cursor-pointer flex-1 mx-4 ${
								filter === field ? 'bg-main_light' : 'border border-white'
							}`}
							onPress={() => setFilter(field as 'amount' | 'price')}
						>
							{field}
						</Text>
					))}
				</View>
      <View>
        
				{!changes || changes.length === 0 ? (
					<View className=' w-full mt-5'>
						<View className='w-full justify-center items-center bg-black-700 h-24 rounded-xl flex flex-col '>
							<Text className='text-white text-lg text-center font-semibold'>
								No Data Available
							</Text>
							<Text className='text-white text text-center font-lexend_light'>
								Try adjusting your filter or time range to see results. Or add
								an item to the folder
							</Text>
						</View>
					</View>
				) : (
					<TouchableWithoutFeedback onPress={() => setSelectedPoint(null)}>
						<View>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								keyboardShouldPersistTaps='handled'
							>
								<PinchGestureHandler onGestureEvent={handlePinch}>
									<View>
										<LineChart
											data={{
												labels,
												datasets: [
													{
														data: dataPoints,
														color: (opacity = 1) => '#D93621',
														strokeWidth: 2,
													},
												],
											}}
											width={chartWidth}
											height={240}
											yAxisSuffix=''
											yAxisInterval={1}
											chartConfig={{
												backgroundColor: '#323232',
												backgroundGradientFrom: '#323232',
												backgroundGradientTo: '#323232',
												decimalPlaces: 2,
												color: (opacity = 1) =>
													`rgba(255, 255, 255, ${opacity})`,
												labelColor: (opacity = 1) =>
													`rgba(255, 255, 255, ${opacity})`,
												propsForDots: {
													r: '6',
													strokeWidth: '2',
													stroke: '#ffffffb4',
												},
											}}
											bezier
											style={{
												marginVertical: 0,
												borderRadius: 16,
												paddingTop: 25,
												backgroundColor: '#323232',
												marginHorizontal: 12,
											}}
											onDataPointClick={data => {
												setSelectedPoint({
													x: data.x,
													y: data.y,
													value: data.value,
												})
											}}
										/>

										{selectedPoint && (
											<View
												className='bg-black/70 p-2 border border-white/50 rounded-lg px-4'
												style={{
													position: 'absolute',
													left: selectedPoint.x - 30,
													top: selectedPoint.y - 20,
												}}
											>
												<Text className='text-white font-bold'>
													{selectedPoint.value}
												</Text>
											</View>
										)}
									</View>
								</PinchGestureHandler>
							</ScrollView>
						</View>
					</TouchableWithoutFeedback>
				)}
      </View>
		</GestureHandlerRootView>
	)
}

export default AnalyticsChart
