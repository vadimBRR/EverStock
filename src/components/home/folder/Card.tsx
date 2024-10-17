import { View, Text, Image } from 'react-native'
import React from 'react'
import { Tables } from '@/src/types/types'
import { currency } from '@/src/constants'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type Props = {
  data: Tables<'folders'> & { totalPrice: number, totalQuantity: number, totalMembers: number, lastUpdated: Date, items: Tables<'items'>, warehouse_users: Tables<'warehouse_users'> }

}


export default function Card({data}: Props) {
  

  return (
    <View className='w-full bg-white rounded-[17px] py-3 px-4 mb-2 border border-black/10'>
      <Text className='font-lexend_regular text-xl'>{data.name}</Text>
      <View className='flex-row items-center justify-between'>
        <View className='flex-row '>
          <View className='flex-row  items-center  mr-2'>
              <Image source={require('@/src/assets/icons/stats/quantity.png')} className='w-5 h-5 aspect-square' />
              <Text className='font-lexend_regular text-gray text-lg ml-0' >{data.totalQuantity}</Text>
            </View>
            <View className='flex-row items-center mr-2'>
              <Text className='font-lexend_regular text-gray text-lg' >{currency.find(c => c.name === data.currency)?.value}{data.totalQuantity}</Text>
            </View>
            <View className='flex-row items-center '>
            <Image source={require('@/src/assets/icons/stats/members.png')} className='w-5 h-5 aspect-square' />
              <Text className='font-lexend_regular text-gray text-lg ' >{data.totalQuantity}</Text>
            </View>

        </View>
        <View>
          <Text className='font-lexend_extralight text-gray text-md' >{dayjs(data.lastUpdated).fromNow()}</Text>
        </View>
        

      </View>

    </View>
  )
}