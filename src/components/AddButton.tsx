import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'

type Props = {
  handlePressAdd: () => void
}
export default function AddButton({handlePressAdd}: Props) {
  return (
    <Pressable className='aspect-square h-[45px] bg-white border-gray rounded-[14px] items-center justify-center border border-black/10' onPress={handlePressAdd}>
      <Image source={require('@/src/assets/icons/plus.png')} />
    </Pressable>
  )
}