import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const HistoryContainer = () => {
	return (
		<View className=' bg-black-700 rounded-[17px] py-3 mb-2 border border-black/10 mx-2 mt-4'>
			<View className='flex flex-row items-center justify-between px-2' >
				<View className='w-fit '>
					<Text className='font-lexend_semibold text-lg  text-white w-min px-2'>
						History:
					</Text>
				</View>
				<View className='flex-row items-center gap-2'>
					<TouchableOpacity className='bg-main_light rounded-[17px] py-2 px-3 '>
						<Text className='font-lexend_semibold text-[14px] text-white'>
							Export
						</Text>
					</TouchableOpacity>
					<TouchableOpacity className='bg-main_light rounded-[17px] py-2 px-3 '>
						<Text className='font-lexend_semibold text-[14px] text-white'>
							Detailed View
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	)
}

export default HistoryContainer
