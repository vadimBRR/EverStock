import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { currency } from '@/src/constants'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Href, useRouter } from 'expo-router'
import RemoteImage from '../../RemoteImage'
import { itemType } from '@/src/types/types'

dayjs.extend(relativeTime)

type Props = {
	item: itemType
	currencyName: string
}

export default function CardItem({ item, currencyName }: Props) {
	const router = useRouter()
	const currencySymbol = currency.find(c => c.name === currencyName)?.value

	return (
		<TouchableOpacity
			className='w-full bg-black-700 rounded-[17px] py-2 px-3 mb-2 border border-black/10'
			onPress={() =>
				router.push(('/(authenticated)/(tabs)/home/item/' + item.id) as Href)
			}
		>
			<View className='flex-row items-center'>
				<RemoteImage
					path={item.image_url ? item.image_url[0] : null}
					className='h-[60px] w-[60px] aspect-square mr-3 rounded-md'
				/>
				<View>
					{item.name.length > 20 ? (
						<Text className='font-lexend_regular text-base'>
							{item.name.length > 28
								? `${item.name.slice(0, 28)}...`
								: item.name}
						</Text>
					) : (
						<Text className='font-lexend_regular text-xl text-white'>
							{item.name}
						</Text>
					)}
					{/* <Text className='font-lexend_regular text-xl truncate'>
            {item.name.length > 20 ? `${item.name.slice(0, 20)}...` : item.name}

					</Text> */}
					<View className='flex-row'>
            {item.amount ? (
              <Text className='text-gray font-poppins_regular text-sm'>
                {item.amount} units{' '}
              </Text>
              
            ): null}
						{item.price ? (
							<View className='flex-row'>
								<Text className='text-gray font-poppins_regular text-sm'>
									- {currencySymbol}
									{(item.price).toFixed(2)}&nbsp;
								</Text>
                {item.amount ? (
                  <Text className='text-gray font-poppins_regular text-sm'>
                    ({currencySymbol}
                    {(item.price * item.amount).toFixed(2)})
                  </Text>
                  
                ): null}
							</View>
						) : null
              }
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}
