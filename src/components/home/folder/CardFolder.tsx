import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Tables } from '@/src/types/types'
import { currency } from '@/src/constants'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Href, useRouter } from 'expo-router'

dayjs.extend(relativeTime)

type Props = {
  data: Tables<'folders'> & { totalPrice: number, totalQuantity: number, totalMembers: number, lastUpdated: Date }

}


export default function Card({data}: Props) {
  const router = useRouter()



  return (
    <TouchableOpacity className='w-full bg-white rounded-[17px] py-3 px-4 mb-2 border border-black/10'     onPress={() => router.push('/(authenticated)/(tabs)/home/folder/' + data.id as Href)}

>
      <Text className='font-lexend_regular text-xl'>{data.name}</Text>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row '>
          <View className='flex-row  items-center  mr-2'>
              <Image source={require('@/src/assets/icons/stats/quantity_opacity.png')} className='w-5 h-5 aspect-square' />
              <Text className='font-lexend_regular text-gray text-lg ml-0' >{data.totalQuantity}</Text>
            </View>
            <View className='flex-row items-center mr-2'>
              <Text className='font-lexend_regular text-gray text-lg' >{currency.find(c => c.name === data.currency)?.value}{data.totalPrice.toFixed(2)}</Text>
            </View>
            <View className='flex-row items-center '>
            <Image source={require('@/src/assets/icons/stats/members_opacity.png')} className='w-5 h-5 aspect-square' />
              <Text className='font-lexend_regular text-gray text-lg ' >{data.totalMembers}</Text>
            </View>

        </View>
        <View>
          <Text className='font-lexend_extralight text-gray text-md' >{dayjs(data.lastUpdated).fromNow()}</Text>
        </View>
        

      </View>

    </TouchableOpacity>
  )
}