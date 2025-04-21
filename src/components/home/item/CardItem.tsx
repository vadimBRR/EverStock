import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { currency } from '@/src/constants'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Href, useRouter } from 'expo-router'
import RemoteImage from '../../RemoteImage'
import { Tables } from '@/src/types/types'
import { useAccount } from '@/src/providers/AccountProvider'
import { showInfo } from '@/src/utils/toast'

dayjs.extend(relativeTime)

type Props = {
	item: Tables<'items'>
	currencyName: string
	isPressable?: boolean
	containerStyle?: string
  isShowWarning?: boolean
}

export default function CardItem({
	item,
	currencyName,
	isPressable = true,
	containerStyle,
  isShowWarning = true
}: Props) {
	const router = useRouter()
	const currencySymbol =
		currency.find(c => c.name === currencyName)?.value || '₴'

	const view = useAccount().viewSettings.viewOptions

	return (
		<TouchableOpacity
			className={`w-full bg-black-700 rounded-[17px] py-2 px-3 mb-2 border border-black/10 ${containerStyle}`}
			onPress={() =>
				isPressable &&
				router.push(('/(authenticated)/(tabs)/home/item/' + item.id) as Href)
			}
		>
			<View className='flex-row items-center'>
				{view.image && (
					<RemoteImage
						path={item.image_url ? item.image_url[0] : null}
						className='h-[60px] w-[60px] aspect-square mr-3 rounded-md'
					/>
				)}

				<View className='flex-1'>
					{view.name && (
						<View className='flex flex-row items-center justify-between'>
							<View>
								{item.name.length > 20 ? (
									<Text className='font-lexend_regular text-base  text-white'>
										{item.name.length > 24
											? `${item.name.slice(0, 24)}...`
											: item.name}
									</Text>
								) : (
									<Text className='font-lexend_regular text-xl text-white'>
										{item.name}
									</Text>
								)}
							</View>
              {isShowWarning && <View>
								{item.quantity &&
								item.min_quantity &&
								item.min_quantity !== 0 &&
								item.quantity < item.min_quantity ? (
									<TouchableOpacity
										onPress={() =>
											showInfo(
												`Minimum required quantity: ${item.min_quantity}`
											)
										}
										className='h-6 w-10  items-center justify-center ml-2'
									>
										<View className='h-2 w-2 rounded-full bg-red-500' />
									</TouchableOpacity>
								) : (
									<View className='h-2 w-2 rounded-full bg-transparent ml-2' />
								)}
							</View>}
							
						</View>
					)}

					<View className='flex-row'>
						{view.quantity && item.quantity != null ? (
							<Text className='text-gray font-poppins_regular text-sm'>
								{item.quantity} units{' '}
							</Text>
						) : null}

						{view.price &&
						view.quantity &&
						item.price != null &&
						item.quantity != null ? (
							<Text className='text-gray font-poppins_regular text-sm'>- </Text>
						) : null}

						{view.price && item.price != null ? (
							<View className='flex-row'>
								<Text className='text-gray font-poppins_regular text-sm'>
									{currencySymbol}
									{item.price.toFixed(2)}&nbsp;
								</Text>
							</View>
						) : null}
						{item.quantity != null && view.totalPrice && item.price != null ? (
							<Text className='text-gray font-poppins_regular text-sm'>
								({currencySymbol}
								{(item.price * item.quantity).toFixed(2)})
							</Text>
						) : null}
					</View>
				</View>
			</View>
		</TouchableOpacity>
	)
}
