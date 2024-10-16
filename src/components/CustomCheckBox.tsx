import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
  text: string,
  checked: boolean,
  onPress: () => void
}
export default function CustomCheckBox({text, checked, onPress}: Props) {
  return (
    <View>
      <TouchableOpacity className='' onPress={onPress}>
        <View className='flex-row '>
          <View className={`w-[30px] h-[30px] rounded-[6px] border-2 border-main_light flex justify-center items-center`}>
            <View className={`w-[20px] h-[20px] rounded-[6px] ${checked ? 'bg-main_light' : ''}`}></View>
          </View>
          <Text className='ml-2 font-lexend_regular text-xl'>{text}</Text>
        </View>
        </TouchableOpacity>
    </View>
  )
}