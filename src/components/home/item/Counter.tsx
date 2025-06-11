import { Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { DefaultTheme, TextInput } from 'react-native-paper'

const Counter = ({
  quantity,
  item_id,
  setQuantity,
  type,
}: {
  quantity: string
  item_id: number
  setQuantity: (quantity: number) => void
  type: string
}) => {
  const [localQuantity, setLocalQuantity] = useState(quantity)

  const handleMinus = () => {
    const current = parseInt(localQuantity) || 0
    if (current > 0) {
      setLocalQuantity((current - 1).toString())
      setQuantity(current - 1)
    }
  }

  const handlePlus = () => {
    const current = parseInt(localQuantity) || 0
    setLocalQuantity((current + 1).toString())
    setQuantity(current + 1)
  }

  const handleChange = (text: string) => {
    // Дозволяємо тільки числа
    if (/^\d*$/.test(text)) {
      setLocalQuantity(text)
    }
  }

  const handleBlur = () => {
    const current = parseInt(localQuantity)
    if (isNaN(current)) {
      setLocalQuantity('0')
      setQuantity(0)
    } else {
      setLocalQuantity(current.toString())
      setQuantity(current)
    }
  }

  return (
    <View className='flex flex-row justify-between mb-2'>
      <TouchableOpacity
        className='h-[54px] w-[54px] flex items-center justify-center rounded-2xl bg-black-600 border border-dark_gray'
        onPress={handleMinus}
      >
        <AntDesign name='minus' size={24} color='white' />
      </TouchableOpacity>

      <View className='rounded-2xl bg-black-600 border border-dark_gray overflow-hidden relative w-1/2'>
        <View>
          <TextInput
            label='.'
            value={localQuantity}
            onChangeText={handleChange}
            onBlur={handleBlur}
            className='bg-black-600 h-[54px] text-center'
            underlineStyle={{
              display: 'none',
            }}
            theme={{
              colors: { primary: '#2a2a2a', onSurfaceVariant: '#2a2a2a' },
              fonts: {
                ...DefaultTheme.fonts,
                bodyLarge: {
                  fontFamily: 'LexendDeca-Regular',
                },
              },
            }}
            underlineColor='transparent'
            textColor='white'
            contentStyle={{
              marginTop: 0,
            }}
            keyboardType='number-pad'
            numberOfLines={1}
          />
        </View>
        <View className='absolute top-2 self-center'>
          <Text className='text-gray font-lexend_regular text-[12px]'>
            Quantity:
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className='h-[54px] w-[54px] flex items-center justify-center rounded-2xl bg-black-600 border border-dark_gray'
        onPress={handlePlus}
      >
        <AntDesign name='plus' size={24} color='white' />
      </TouchableOpacity>
    </View>
  )
}

export default Counter
