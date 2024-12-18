import React, { useRef, useState } from 'react'
import {
	View,
	Image,
	Pressable,
	Modal,
	Text,
	Dimensions,
	FlatList,
	TouchableOpacity,
} from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Colors } from '@/src/constants/Colors'
import { Ionicons } from '@expo/vector-icons'
import SmallCarousel from './SmallCarousel'
import { useAccount } from '@/src/providers/AccountProvider'

interface ImageUploaderProps {
	images: string[]
	setImages: React.Dispatch<React.SetStateAction<string[]>>
	isGallery?: boolean
	handleChangeImages?: (images: string[]) => void
}

const ItemImagesCarousel = ({
	images,
	setImages,
	isGallery = false,
	handleChangeImages,
}: ImageUploaderProps) => {
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [selectedImage, setSelectedImage] = useState<string | null>(null)
	const [activeIndex, setActiveIndex] = useState<number>(0)
	const width = Dimensions.get('window').width
	const viewabilityConfig = {
		itemVisiblePercentThreshold: 50,
	}

	const flatListRef = useRef<FlatList<string>>(null)

	const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (viewableItems.length > 0) {
			const index = viewableItems[0].index || 0
			setActiveIndex(index)
		}
	}).current

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [3, 3],
			quality: 1,
		})

		if (!result.canceled && result.assets) {
			if (images.length < 3) {
				if (isGallery && handleChangeImages)
					handleChangeImages([...images, result.assets[0].uri])
				else setImages([...images, result.assets[0].uri])
			}
		}
	}

	const deleteImage = () => {
		if (activeIndex !== null) {
			if (isGallery && handleChangeImages) {
				handleChangeImages(images.filter((_, index) => index !== activeIndex))
			} else setImages(images.filter((_, index) => index !== activeIndex))
			setActiveIndex(prev => (prev > 0 ? prev - 1 : 0))
			setIsModalVisible(false)
		}
	}

	const handleOpenImage = (image: string, index: number) => {
		setSelectedImage(image)
		setActiveIndex(index)
		setIsModalVisible(true)
	}

	const handleCloseImage = () => {
		setIsModalVisible(false)
		setSelectedImage(null)
	}

	const setAsMain = () => {
		if (selectedImage && activeIndex !== 0) {
			const updatedImages = [...images]
			const [imageToMove] = updatedImages.splice(activeIndex, 1)
			updatedImages.unshift(imageToMove)
			if (isGallery && handleChangeImages) {
				handleChangeImages(updatedImages)
			} else {
				setImages(updatedImages)
			}
			handleCloseImage()
		}
	}

	return (
		<View className='mb-0'>
			{isGallery && images.length > 0 ? (
				<SmallCarousel images={images} handleOpenImage={handleOpenImage} />
			) : (
				<View className='flex-row gap-8 mb-5'>
					{images.map((image, index) => (
						<Pressable
							onPress={() => handleOpenImage(image, index)}
							key={index}
						>
							<Image
								source={{ uri: image }}
								className='w-[100px] self-center aspect-square rounded-2xl'
							/>
						</Pressable>
					))}
					{images.length < 3 && (
						<Pressable onPress={pickImage}>
							<Image
								source={require('@/src/assets/upload_image_dark.png')}
								className='w-[100px] h-[100px] self-center aspect-square'
								resizeMode='contain'
							/>
						</Pressable>
					)}
				</View>
			)}

			<Modal visible={isModalVisible} transparent={true}>
				<View className='flex-1 justify-center items-center bg-bg relative'>
					<TouchableOpacity
						className='absolute top-2 left-3'
						onPress={handleCloseImage}
					>
						<Ionicons name='close' color={'gray'} size={40} />
					</TouchableOpacity>

					<View style={{ height: width }}>
						<FlatList
							ref={flatListRef}
							data={images}
							horizontal
							pagingEnabled
							snapToAlignment='center'
							snapToInterval={width}
							decelerationRate='fast'
							keyExtractor={image => image}
							onViewableItemsChanged={onViewableItemsChanged}
							viewabilityConfig={viewabilityConfig}
							initialNumToRender={images.length}
							removeClippedSubviews={false}
							style={{ height: width }}
							renderItem={({ item }) => (
								<Image
									source={{ uri: item }}
									style={{ width: width, height: width, resizeMode: 'contain' }}
								/>
							)}
						/>
					</View>
					<View style={{ flexDirection: 'row', marginTop: 10 }}>
						{images.map((_, index) => (
							<View
								key={index}
								style={{
									width: 10,
									height: 10,
									borderRadius: 5,
									backgroundColor:
										activeIndex === index ? Colors.light.main : 'gray',
									marginHorizontal: 5,
								}}
							/>
						))}
					</View>
				</View>

				<View className='bg-black-600 flex-row justify-around p-4 rounded-t-2xl'>
					{images.length < 3 && (
						<TouchableOpacity className='flex items-center' onPress={pickImage}>
							<Ionicons name='add' size={24} color={'white'} />
							<Text className='text-lg text-white font-lexend_regular'>
								Add
							</Text>
						</TouchableOpacity>
					)}

					{activeIndex !== 0 && (
						<TouchableOpacity className='flex items-center' onPress={setAsMain}>
							<Ionicons name='star-outline' size={24} color='white' />
							<Text className='text-lg text-white font-lexend_regular'>
								Set as Main
							</Text>
						</TouchableOpacity>
					)}

					<TouchableOpacity className='flex items-center' onPress={deleteImage}>
						<Ionicons name='trash-outline' size={24} color={'white'} />
						<Text className='text-lg text-white font-lexend_regular'>
							Delete
						</Text>
					</TouchableOpacity>
				</View>
			</Modal>
		</View>
	)
}

export default ItemImagesCarousel
