import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { currency } from '@/src/constants'
import { Href, useRouter } from 'expo-router'
import RemoteImage from '../../RemoteImage'
import { itemType } from '@/src/types/types'
import { useAccount } from '@/src/providers/AccountProvider'
import { Entypo } from '@expo/vector-icons'

type Props = {
	item: itemType
	currencyName: string
	isPressable?: boolean
	containerStyle?: string
	activeItemId: number | null
	setActiveItemId: (id: number | null) => void
}

export default function CardItemFastEdit({
	item,
	currencyName,
	isPressable = true,
	containerStyle,
	activeItemId,
	setActiveItemId
}: Props) {
	const router = useRouter()
	const currencySymbol = currency.find(c => c.name === currencyName)?.value || '₴'
	const { handleUpdateItem } = useAccount()
	const view = useAccount().viewSettings.viewOptions

	const isActive = activeItemId === item.id
	const [quantity, setQuantity] = useState(item.amount ?? 0)
	const [isEditing, setIsEditing] = useState(false) 

	const handleChangeLocalQuantity = (newQuantity: number) => {
		if (newQuantity < 0) return
		setQuantity(newQuantity)
	}

	const handleInputChange = (text: string) => {
		const num = parseInt(text, 10)
		if (!isNaN(num) && num >= 0) {
			setQuantity(num)
		}else{
      setQuantity(0);
    }
	}

	const handleSave = () => {
		handleUpdateItem({ ...item, quantity })
		setActiveItemId(null) 
		setIsEditing(false) 
	}

	const toggleActive = () => {
		if (isActive) {
			handleSave()
		} else {
			setActiveItemId(item.id)
		}
	}

	return (
		<TouchableOpacity
			className={`w-full bg-black-700 rounded-[17px] py-2 px-3 mb-2 border border-black/10 ${containerStyle}`}
			onPress={toggleActive}
		>
			<View className='w-full flex-row items-center justify-between'>
				<View className='flex-row items-center'>
					{view.image && (
						<RemoteImage
							path={item.image_url ? item.image_url[0] : null}
							className='h-[60px] w-[60px] aspect-square mr-3 rounded-md'
						/>
					)}

					<View>
						{view.name && (
							<Text className='font-lexend_regular text-xl text-white'>
								{item.name}
							</Text>
						)}

						{!isActive && (
							<Text className='text-gray font-poppins_regular text-sm'>
								{item.amount} units
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
							<Entypo name="minus" size={24} color="#cccccc" />
						</TouchableOpacity>

						<TouchableOpacity onPress={() => setIsEditing(true)}>
							{isEditing ? (
								<TextInput
									className='text-white text-lg mx-3 bg-gray-800 px-2 rounded-md'
									value={quantity.toString()}
									onChangeText={handleInputChange}
									keyboardType="numeric"
									autoFocus
									onBlur={handleSave} 
								/>
							) : (
								<Text className='text-white text-lg mx-3'>{quantity}</Text>
							)}
						</TouchableOpacity>

						<TouchableOpacity
							className='bg-gray-600 px-3 py-1 rounded-md'
							onPress={() => handleChangeLocalQuantity(quantity + 1)}
						>
							<Entypo name="plus" size={24} color="#cccccc" />
						</TouchableOpacity>
					</View>
				)}
			</View>
		</TouchableOpacity>
	)
}
