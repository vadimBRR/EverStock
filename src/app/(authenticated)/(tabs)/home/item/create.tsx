import React, { useState } from 'react'
import { View, Text, TextInput, ScrollView } from 'react-native'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import ItemImagesCarusel from '@/src/components/home/item/ItemImagesCaruselCreate'
import EvilIcons from '@expo/vector-icons/EvilIcons'
import CustomRadioButton from '@/src/components/CustomRadioButton'
import { client } from '@/src/utils/supabaseClient'
import * as FileSystem from 'expo-file-system'
import { decode } from 'base64-arraybuffer'
import { randomUUID } from 'expo-crypto'
import { useCreateItem } from '@/src/api/item'
import { useSupabase } from '@/src/providers/SupabaseProvider'
import {  showError } from '@/src/utils/toast'

export default function CreateItem() {
	const { id: idString } = useLocalSearchParams()
	const folder_id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

	const [itemName, setItemName] = useState('')
	const [quantity, setQuantity] = useState('')
	const [price, setPrice] = useState('')
	const [minQuantity, setMinQuantity] = useState('')
	const [note, setNote] = useState('')
	const [tag, setTag] = useState<string>()
	const [selectedType, setSelectedType] = useState('quantity')
	const typesAmount = ['quantity', 'weight', 'volume']

	const [images, setImages] = useState<string[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const { mutate: createItem } = useCreateItem()
	const { createTransaction } = useSupabase()

	const uploadImages = async () => {
		const uploadedImagePaths = await Promise.all(
			images.map(async image => {
				if (image.startsWith('file://')) {
					const base64 = await FileSystem.readAsStringAsync(image, {
						encoding: 'base64',
					})
					const filePath = `${randomUUID()}.png`
					const { data, error } = await client.storage
						.from('item-images')
						.upload(filePath, decode(base64), {
							contentType: 'image/png',
						})

					if (error) {
						console.error('Upload failed:', error.message)
						return null
					}

					return data?.path || null
				}

				return image
			})
		)

		return uploadedImagePaths.filter(path => path !== null)
	}

	const handleCreateItem = async () => {
		if (
			!itemName ||
			(quantity && isNaN(+quantity)) ||
			(price && isNaN(+price))
		) {
			showError('Please fill required fields correctly')
			return
		}

		try {
			setIsLoading(true)
			const uploadedImagePaths = await uploadImages()

			await createItem(
				{
					folder_id,
					name: itemName,
					images: uploadedImagePaths,
					price: price ? parseFloat(price) : 0,
					quantity: parseInt(quantity),
					note,
					tag: tag || '',
					typeAmount: selectedType,
          min_quantity: minQuantity ? parseInt(minQuantity) : 0,
				},
				{
					onSuccess: async createdItem => {
						if (createdItem && createdItem[0]) {
							const item = createdItem[0]
							await createTransaction?.(item.id!, folder_id, 'created', {
								changed_item: item,
								prev_item: null,
								changes: Object.keys(item),
							})
						}
						setIsLoading(false)
						router.back()
					},
					onError: (err: any) => {
						showError('Failed to create item', err.message)
					},
				}
			)
		} catch (error: any) {
			showError('Something went wrong', error.message)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Item',
					headerStyle: { backgroundColor: '#242121' },
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
					<View>
						<ItemImagesCarusel images={images} setImages={setImages} />

						<CustomInput
							label={'Item name *'}
							name={itemName}
							setName={setItemName}
							containerStyle='mb-2'
						/>
						{/* <View className='w-full flex flex-row justify-between mb-2 bg-black-600 border border-dark_gray rounded-2xl p-3'>
							{typesAmount.map((type, index) => (
								<CustomRadioButton
									key={index}
									text={type.charAt(0).toUpperCase() + type.slice(1)}
									checked={type === selectedType}
									onPress={() => setSelectedType(type)}
								/>
							))}
						</View> */}
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
						<CustomInput
							label={'Minimum Quantity (optional)'}
							name={minQuantity}
							setName={setMinQuantity}
							containerStyle='mb-2'
							keyboardType='numeric'
						/>
						<View className='mb-2 bg-black-600 border border-dark_gray rounded-2xl w-full px-2 flex items-center'>
							<View className='w-full flex flex-row justify-between items-center'>
								<TextInput
									placeholder='Tag'
									className='h-[54px] w-[90%] font-lexend_regular text-[17px] text-white'
									placeholderTextColor='#B6B6B6'
									value={tag}
									onChangeText={setTag}
								/>
								<EvilIcons name='tag' size={34} color='white' />
							</View>
						</View>

						<View className='bg-black-600 h-[54px] border border-dark_gray rounded-2xl justify-center mb-2'>
							<Text className='font-lexend_regular text-lg text-gray mx-3'>
								Total price: {(+price * +quantity).toFixed(2)}
							</Text>
						</View>
						<View className='bg-black-600 border border-dark_gray rounded-2xl mb-2'>
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
					styleContainer='my-4 mx-0'
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
