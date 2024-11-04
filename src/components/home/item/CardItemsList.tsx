import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Tables } from '@/src/types/types'
import { currency } from '@/src/constants'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Href, useRouter } from 'expo-router'
import CardItem from './CardItem'

dayjs.extend(relativeTime)

type Props = {
  data: Tables<'items'>[]
  currency: string
}


export default function CardItemsList({data, currency}: Props) {
  const router = useRouter()



  return (
    <View className='mx-3'>
			{data?.map(item => (
				<CardItem item={item} currencyName={currency} key={item.id} />
				
			))}
		</View>
  )
}