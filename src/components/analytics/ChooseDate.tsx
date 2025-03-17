import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import dayjs from 'dayjs'

type Props = {
	selectedDate: Date | null
	setSelectedDate: (date: Date | null) => void
  isSwitchOn: boolean
}
export default function ChooseDate({ selectedDate, setSelectedDate, isSwitchOn }: Props) {
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)

	const showDatePicker = () => {
		setIsDatePickerVisible(true)
	}
	const hideDatePicker = () => {
		setIsDatePickerVisible(false)
	}

	const handleConfirm = (date: Date) => {
		setSelectedDate(date)
		hideDatePicker()
	}

	return (
		<TouchableOpacity
			className='rounded-2xl  border border-black/10'
			onPress={showDatePicker}
		>
			<View className='px-5 py-2'>
				<View style={{opacity: isSwitchOn ? 1 : 0.3}}>
						<Text className='text-lg font-lexend_light text-white'>
							{selectedDate ? dayjs(selectedDate).format('DD MMM YYYY'): 'Pick a date'}
						</Text>
				</View>
			</View>
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode='date'
				onConfirm={handleConfirm}
				onCancel={hideDatePicker}
				display='calendar'
				// minimumDate={new Date()}
        date={selectedDate || new Date()}
			/>
		</TouchableOpacity>
	)
}
