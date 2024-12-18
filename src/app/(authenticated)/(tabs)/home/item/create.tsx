import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import { ScrollView } from 'react-native'
import ItemImagesCarusel from '@/src/components/home/item/ItemImagesCarusel'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import { useAccount } from '@/src/providers/AccountProvider'
import CustomRadioButton from '@/src/components/CustomRadioButton'

export default function CreateItem() {
	const { id: idString } = useLocalSearchParams()
	const folder_id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

	const [itemName, setItemName] = useState('')
	const [quantity, setQuantity] = useState('')
	const [price, setPrice] = useState('')
	const [note, setNote] = useState('')
	const [tag, setTag] = useState<string>()
	const [selectedType, setSelectedType] = useState('quantity')
	const typesAmount = ['quantity', 'weight', 'volume']

	const [images, setImages] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	if (!folder_id) {
		;<View className='flex-1 justify-center items-center'>
			<Text className='font-bold'>Failed to fetch</Text>
		</View>
	}

	const { handleCreateItem: createItem } = useAccount()

	const handleCreateItem = async () => {
		if (price && !parseFloat(price)) return

		if (quantity && !parseInt(quantity)) return

		setIsLoading(true)
		createItem({
			folder_id: folder_id,
			name: itemName,
			image_url: images,
			price: parseFloat(price),
			quantity: parseInt(quantity),
			note,
			tag,
			typeAmount: selectedType,
		})

		setIsLoading(false)
		router.back()
	}

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Item',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
				}}
			/>
			<ScrollView
				className='mx-4 mt-3 flex-1'
				contentContainerStyle={{ justifyContent: 'space-between' }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
			>
				<View className='flex flex-col flex-1 justify-around'>
					<View className=''>
						<ItemImagesCarusel images={images} setImages={setImages} />

						<CustomInput
							label={'Item name *'}
							name={itemName}
							setName={setItemName}
							containerStyle='mb-2'
						/>
						<View className='w-full flex flex-row justify-between mb-2 bg-black-600 border border-dark_gray rounded-2xl p-3'>
							{typesAmount.map((type, index) => (
								<CustomRadioButton
									key={index}
									text={type.charAt(0).toUpperCase() + type.slice(1)}
									checked={type === selectedType}
									onPress={() => setSelectedType(type)}
								/>
							))}
						</View>
						<CustomInput
							label={
								selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
							}
							name={quantity}
							setName={setQuantity}
							containerStyle='mb-2'
							keyboardType='numeric'
						/>
						<CustomInput
							label={'Price'}
							name={price}
							setName={setPrice}
							containerStyle='mb-2'
							keyboardType='numeric'
						/>
						<View className='mb-2 bg-black-600 border border-dark_gray rounded-2xl w-full px-2 flex items-center'>
							<View className='w-full flex flex-row justify-between items-center  '>
								<TextInput
									placeholder='Tag'
									className='h-[54px] w-[90%] font-lexend_regular  text-[17px] text-white'
									placeholderTextColor='#B6B6B6'
									value={tag}
									onChangeText={setTag}
								/>
								<EvilIcons name='tag' size={34} color='white' />
							</View>
						</View>

						<View className='bg-black-600 h-[54px] border border-dark_gray rounded-2xl justify-center  mb-2'>
							<Text className='font-lexend_regular text-lg text-gray mx-3'>
								Total price: {(+price * +quantity).toFixed(2)}
							</Text>
						</View>
						<View className='bg-black-600  border border-dark_gray rounded-2xl   mb-2'>
							<Text className='absolute top-2 left-4 font-lexend_regular text-gray'>
								Note
							</Text>
							<TextInput
								value={note}
								onChangeText={setNote}
								className='pt-6 px-4 text-white font-lexend_regular'
								style={{
									borderRadius: 16,
									padding: 8,
									fontFamily: 'LexendDeca-Light',
									fontSize: 16,
									textAlignVertical: 'top',
								}}
								editable
								multiline
								numberOfLines={6}
							/>
						</View>
					</View>
				</View>
			</ScrollView>
			<View className='mx-4'>
				<CustomButton
					text='Create Item'
					onClick={handleCreateItem}
					styleContainer={`my-4 mx-0 `}
					disabled={
						!itemName ||
						(quantity ? isNaN(parseFloat(quantity)) : false) ||
						(price ? isNaN(parseFloat(price)) : false)
					}
					isLoading={isLoading}
				/>
			</View>
		</Container>
	)
}
