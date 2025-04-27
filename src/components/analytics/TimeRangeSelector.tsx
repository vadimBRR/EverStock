import { View, Text, TouchableOpacity } from 'react-native'
import ChooseDate from '@/src/components/analytics/ChooseDate'
import { FlatList } from 'react-native-gesture-handler'

type Props = {
  timeRange: string
  setTimeRange: (value: any) => void
  startDate: Date | null
  setStartDate: (d: Date | null) => void
  endDate: Date | null
  setEndDate: (d: Date | null) => void
}

const TimeRangeSelector = ({
  timeRange,
  setTimeRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: Props) => {
  const handleCustomDateChange = (date: Date, isStart: boolean) => {
    if (isStart) setStartDate(date)
    else setEndDate(date)
    setTimeRange('custom')
  }

  return (
      <>
          <View className='p-4 pt-2 pb-0'>
            <FlatList
              data={['all', 'today', '1_week', '2_weeks', '1_month', 'custom']}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 10 }}
              style={{ marginBottom: 15 }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setTimeRange(item as any)
                    setStartDate(null)
                    setEndDate(null)
                  }}
                  className={`rounded-lg border ${
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
    
          {timeRange === 'custom' && (
            <View className='border border-white rounded-lg mb-2 mx-4'>
              <View className='flex-row justify-center items-center'>
                <ChooseDate
                  selectedDate={startDate}
                  setSelectedDate={date =>
                    handleCustomDateChange(date ?? new Date(), true)
                  }
                  isSwitchOn={true}
                />
                <Text className='text-white text-lg'>to</Text>
                <ChooseDate
                  selectedDate={endDate}
                  setSelectedDate={date =>
                    handleCustomDateChange(date ?? new Date(), false)
                  }
                  isSwitchOn={true}
                />
              </View>
            </View>
          )}
          </>
  )
}

export default TimeRangeSelector
