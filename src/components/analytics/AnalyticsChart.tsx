import React, { useState, useMemo } from 'react'
import {
	Dimensions,
	View,
	Text,
	TouchableWithoutFeedback,
	TouchableOpacity,
} from 'react-native'
import { LineChart } from 'react-native-chart-kit'
import {
	ScrollView,
	GestureHandlerRootView,
	PinchGestureHandler,
} from 'react-native-gesture-handler'
import CustomInput from '@/src/components/CustomInput'
import { Tables } from '@/src/types/types'

type Props = {
	transaction: any
	timeRange: string
	setTimeRange: (v: any) => void
	startDate: Date | null
	setStartDate: (d: Date | null) => void
	endDate: Date | null
	setEndDate: (d: Date | null) => void
}

const AnalyticsChart = ({
	transaction,
	timeRange,
	startDate,
	endDate,
}: Props) => {
	const [filter, setFilter] = useState<'amount' | 'price'>('amount')
	const [samplingRateInput, setSamplingRateInput] = useState('30')
	const [samplingRate, setSamplingRate] = useState(30)

	const filtered = useMemo(() => {
		const now = new Date()
		let fromDate: Date | null = null

		switch (timeRange) {
			case 'today':
				fromDate = new Date()
				fromDate.setHours(0, 0, 0, 0)
				break
			case '1_week':
				fromDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
				break
			case '2_weeks':
				fromDate = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
				break
			case '1_month':
				fromDate = new Date()
				fromDate.setMonth(now.getMonth() - 1)
				break
			case 'custom':
				fromDate = startDate
				break
			default:
				fromDate = null
		}

		return transaction.filter((t: any) => {
			const date = new Date(t.date)
			const passStart = fromDate ? date >= fromDate : true
			const passEnd = endDate ? date <= endDate : true
			return passStart && passEnd
		})
	}, [transaction, timeRange, startDate, endDate])

	const changes = useMemo(() => {
		return [...filtered]
			.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
			.map(t => {
				const date = t.date
				const value =
					filter === 'amount'
						? t.changed_item?.quantity ?? 0
						: t.changed_item?.price ?? 0
				return {
					date,
					value: isNaN(value) || !isFinite(value) ? 0 : value,
				}
			})
	}, [filtered, filter])

	const sampledChanges = useMemo(() => {
		if (changes.length <= samplingRate) return changes
		const rate = Math.ceil(changes.length / samplingRate)
		return changes.filter((_, index) => index % rate === 0)
	}, [changes, samplingRate])

	const labels = sampledChanges.map(change => {
		const date = new Date(change.date)
		return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
	})

	const dataPoints = sampledChanges.map(change => change.value)

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

	const handleSamplingBlur = () => {
		const parsed = parseInt(samplingRateInput)
		if (!isNaN(parsed) && parsed > 0) {
			setSamplingRate(parsed)
		} else {
			setSamplingRate(30)
			setSamplingRateInput('30')
		}
	}

	return (
		<GestureHandlerRootView className='bg-bg'>
			<View className='mx-4 mt-2'>
				<Text className='text-lg text-white font-lexend_semibold'>
					Inventory Changes
				</Text>
			</View>

			<View className='flex-row justify-between items-center mx-4 my-2'>
				{['amount', 'price'].map(field => (
					<Text
						key={field}
						className={`py-2 rounded-lg text-white text-center cursor-pointer flex-1 mx-2 ${
							filter === field ? 'bg-main_light' : 'border border-white'
						}`}
						onPress={() => setFilter(field as any)}
					>
						{field}
					</Text>
				))}
			</View>

			

			<View>
				{!changes || changes.length === 0 ? (
					<View className='w-full mt-5'>
						<View className='w-full justify-center items-center bg-black-700 h-24 rounded-xl flex flex-col'>
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
							<ScrollView horizontal showsHorizontalScrollIndicator={false}>
								<PinchGestureHandler onGestureEvent={handlePinch}>
									<View>
										<LineChart
											data={{
												labels,
												datasets: [
													{
														data: dataPoints,
														color: () => '#D93621',
														strokeWidth: 2,
													},
												],
											}}
											width={chartWidth}
											height={240}
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
											}}
											onDataPointClick={data =>
												setSelectedPoint({
													x: data.x,
													y: data.y,
													value: data.value,
												})
											}
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
													{filter === 'amount'
														? selectedPoint.value
														: selectedPoint.value.toFixed(2)}
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
