import { View, Text, Image, Pressable, Modal, TouchableWithoutFeedback, TextInput } from 'react-native'
import React, { useState } from 'react'
import Container from '@/src/components/Container'
import { Href, Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import * as ImagePicker from 'expo-image-picker'
import { ScrollView } from 'react-native'
import * as FileSystem from 'expo-file-system'
import { useCreateItem } from '@/src/api/item'
import { randomUUID } from 'expo-crypto'
import { decode } from 'base64-arraybuffer'
import { client } from '@/src/utils/supabaseClient'

export default function CreateItem() {
  const { id:idString } = useLocalSearchParams()
  const folder_id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)



	// const [folderName, setFolderName] = useState('')
	const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')

	const [images, setImages] = useState<string[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router= useRouter();
  const {mutate:createItem} = useCreateItem();

	const pickImage = async () => {
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [3, 3],
			quality: 1,
		})

		console.log(result)

		if (!result.canceled && result.assets) {
			if (images.length < 3) {
				setImages([...images, result.assets[0].uri])
			}
		}
	}
  const deleteImage = () => {
		if (selectedImage) {
			setImages(images.filter((image) => image !== selectedImage))
			setSelectedImage(null)
			setIsModalVisible(false)
		}
	}
  const handleOpenImage = (image: string) => {
    console.log(image);
    setSelectedImage(image)
    setIsModalVisible(true)
  }
  const handleCloseImage = () => {
    setIsModalVisible(false)
    setSelectedImage(null)
  }

  
  if (!folder_id) {
		<View className='flex-1 justify-center items-center'>
			<Text className='font-bold'>Failed to fetch</Text>
		</View>
	}

  const uploadImages = async () => {
    const uploadedImagePaths = await Promise.all(
      images.map(async (image) => {
        if (image.startsWith('file://')) {
          const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });
          const filePath = `${randomUUID()}.png`;
          const contentType = 'image/png';
          
          const { data, error } = await client.storage
            .from('item-images')
            .upload(filePath, decode(base64), { contentType });
  
          if (error) {
            console.error(`Failed to upload image: ${error.message}`);
            return null;
          }
          return data.path;
        }
        return null;
      })
    );
  
    return uploadedImagePaths.filter(path => path !== null); 
  };
  

	const handleCreateItem = async () => {
		console.log('create item')
    if(price && !parseFloat(price)) return;
    console.log("bam1");
    if(quantity && !parseInt(quantity)) return;
    console.log("bam2");
    setIsLoading(true);
    const uploadedImagePaths = await uploadImages();

    await createItem({folder_id: folder_id, name: itemName, images: uploadedImagePaths, price:parseFloat(price), quantity:parseInt(quantity), note}  , {
      onSuccess: () => {
        setIsLoading(false);
        router.back()
      },
    } )

    setIsLoading(false);

	}


	return (
		<Container isPadding={false}>
			<Stack.Screen options={{ headerShown: true, title: 'Item' }} />
			<ScrollView className='mx-4 mt-3 flex-1' contentContainerStyle={{justifyContent: 'space-between'}}>
				<View>
					<View className='flex-row gap-8 mb-5'>
						{images.map((image, index) => (
              <Pressable onPress={()=>handleOpenImage(image)} key={index}>
                  <Image
                    
                    source={{ uri: image }}
                    className='w-[100px] self-center aspect-square rounded-2xl'
                  />
              </Pressable>
						))}
						{images.length < 3 && (
							<Pressable onPress={pickImage}>
								<Image
									source={
											require('@/src/assets/upload_image.png')
									}
									className='w-[100px] self-center aspect-square'
									resizeMode='contain'
								/>
							</Pressable>
						)}
					</View>

					{/* <CustomInput
						label={'Name of the folder'}
						name={folderName}
						setName={setFolderName}
            containerStyle='mb-2'
					/> */}
					<CustomInput
						label={'Item name *'}
						name={itemName}
						setName={setItemName}
            containerStyle='mb-2'
					/>
					<CustomInput
						label={'Quantity'}
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
          <View className='bg-white h-[54px] border border-black/10 rounded-2xl justify-center  mb-2'>
            <Text className='font-lexend_regular text-lg text-gray mx-3'>Total price: {+price*+quantity}</Text>
          </View>
          <View className='bg-white  border border-black/10 rounded-2xl   mb-2'>
          <Text className='absolute top-2 left-4 font-lexend_regular text-gray'>Note</Text>
          <TextInput
									value={note}
									onChangeText={setNote}
									className='pt-6 px-4'
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
				<CustomButton
					text='Create Item'
					onClick={handleCreateItem}
					styleContainer={`my-4 mx-0 `}
					disabled={ !itemName ||  (quantity ? isNaN(parseFloat(quantity)) : false) || 
            (price ? isNaN(parseFloat(price)) : false)}
				/>
			</ScrollView>
      <Modal visible={isModalVisible} transparent={true} >
				<Pressable className='flex-1 justify-center items-center bg-black/50 bg-opacity-80' onPress={handleCloseImage}>
					<Image source={{ uri: selectedImage! }} className='w-[90%] aspect-square' resizeMode='contain' />
					<View className=' justify-center mt-2 w-full '>
            {/* <CustomButton text='Delete' styleContainer='bg-red-500 mb-2' onClick={deleteImage} />
            <CustomButton text='Close' onClick={handleCloseImage}/> */}

						<View className='flex-row justify-between mx-5 '>

            <Pressable onPress={handleCloseImage} className='flex-1  bg-white p-2 px-10 items-center  mr-2'>
              <Image source={require('@/src/assets/icons/close_dark.png')} className='w-8 h-8' />
							<Text className='text-black text-lg font-lexend_light'>Close</Text>
						</Pressable>
						<Pressable onPress={deleteImage} className='flex-1 bg-white p-2 px-10 items-center '>
              <Image source={require('@/src/assets/icons/trash_dark.png')} className='w-8 h-8' />
							<Text className='text-black text-lg font-lexend_light'>Delete</Text>
						</Pressable>
            </View>
					</View>
				</Pressable>
			</Modal>
		</Container>
	)
}
