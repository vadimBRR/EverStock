import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'

type Props = {
  text: string,
  checked: boolean,
  onPress: () => void
}
export default function CustomRadioButton({text, checked, onPress}: Props) {
  return (
    <View>
      <TouchableOpacity className='' onPress={onPress}>
        <View className='flex-row '>
          <View className={`w-[30px] h-[30px] rounded-full border-2 border-white flex justify-center items-center bg-black-600`}>
            <View className={`w-[20px] h-[20px] rounded-full ${checked ? 'bg-white' : ''}`}></View>
          </View>
          <Text className='ml-2 font-lexend_regular text-base text-white '>{text}</Text>
        </View>
        </TouchableOpacity>
    </View>
  )
}