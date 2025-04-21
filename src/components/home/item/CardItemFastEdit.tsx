import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { currency } from '@/src/constants'
import { useRouter } from 'expo-router'
import { Entypo } from '@expo/vector-icons'
import { itemType, Tables } from '@/src/types/types'
import RemoteImage from '../../RemoteImage'

type Props = {
	item: Tables<'items'>
	currencyName: string
	activeItemId: number | null
	setActiveItemId: (id: number | null) => void
	handleQuantityChange: (id: number, quantity: number) => void
	handleSaveItem: ({
		item,
		quantity,
	}: {
		item: Tables<'items'>
		quantity: number
	}) => void
}

export default function CardItemFastEdit({
	item,
	currencyName,
	activeItemId,
	setActiveItemId,
	handleQuantityChange,
	handleSaveItem,
}: Props) {
	const router = useRouter()
	const currencySymbol =
		currency.find(c => c.name === currencyName)?.value || '₴'

	const isActive = activeItemId === item.id
	const [quantity, setQuantity] = useState(item.quantity ?? 0)
	const [isEditing, setIsEditing] = useState(false)

	const handleChangeLocalQuantity = (newQuantity: number) => {
		if (newQuantity < 0) return
		setQuantity(newQuantity)
		handleQuantityChange(item.id, newQuantity)
	}

	const handleInputChange = (text: string) => {
		const num = parseInt(text, 10)
		if (!isNaN(num) && num >= 0) {
			setQuantity(num)
			handleQuantityChange(item.id, num)
		} else {
			setQuantity(0)
			handleQuantityChange(item.id, 0)
		}
	}

  const toggleActive = () => {
    if (isActive) {
      if (quantity !== item.quantity) {
        handleSaveItem({ item, quantity })
      }
      setActiveItemId(null)
    } else {
      setActiveItemId(item.id)
    }
  }
  

	return (
		<TouchableOpacity
			className={`w-full  rounded-[17px] py-2 px-3 mb-2 border ${
				isActive
					? 'bg-black-700/50 border-white/10'
					: 'bg-black-700 border-black/10 '
			}`}
			onPress={toggleActive}
		>
			<View className='w-full flex-row items-center justify-between'>
				<View className='flex-row items-center'>
					<RemoteImage
						path={item.image_url ? item.image_url[0] : null}
						className='h-[60px] w-[60px] aspect-square mr-3 rounded-md'
					/>

					<View>
						{isActive ? (
              <View>
							{item.name.length > 20 ? (
                
								<Text className='font-lexend_regular text-base  text-white'>
									{item.name.length > 18
										? `${item.name.slice(0, 18)}...`
										: item.name}
								</Text>
							) : (
								<Text className='font-lexend_regular text-xl text-white'>
									{item.name}
								</Text>
							)}
						</View>
            ) : (<View>
							{item.name.length > 20 ? (
                
								<Text className='font-lexend_regular text-base  text-white'>
									{item.name.length > 28
										? `${item.name.slice(0, 28)}...`
										: item.name}
								</Text>
							) : (
								<Text className='font-lexend_regular text-xl text-white'>
									{item.name}
								</Text>
							)}
						</View>)}
						{!isActive && (
							<Text className='text-gray font-poppins_regular text-sm'>
								{item.quantity} units
							</Text>
						)}
					</View>
				</View>

				{isActive && (
					<View className='flex-row items-center'>
						<TouchableOpacity
							className='bg-gray-600 px-3 py-1 rounded-md'
							onPress={() => handleChangeLocalQuantity(quantity - 1)}
						>
							<Entypo name='minus' size={24} color='#cccccc' />
						</TouchableOpacity>

						<TouchableOpacity onPress={() => setIsEditing(true)}>
							{isEditing ? (
								<TextInput
									className='text-white text-lg mx-3 bg-gray-800 px-2 rounded-md'
									value={quantity.toString()}
									onChangeText={handleInputChange}
									keyboardType='numeric'
									autoFocus
									onBlur={() => setIsEditing(false)}
								/>
							) : (
								<Text className='text-white text-lg mx-3'>{quantity}</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							className='bg-gray-600 px-3 py-1 rounded-md'
							onPress={() => handleChangeLocalQuantity(quantity + 1)}
						>
							<Entypo name='plus' size={24} color='#cccccc' />
						</TouchableOpacity>
					</View>
				)}
			</View>
		</TouchableOpacity>
	)
}
