import { Image } from 'react-native'
import React, { ComponentProps, useEffect,  useState } from 'react'
// import { client } from '../utils/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

type RemoteImageProps = {
	path?: string | null
} & Omit<ComponentProps<typeof Image>, 'source'>

const RemoteImage = ({ path, ...imageProps }: RemoteImageProps) => {
	const [imageUrl, setImageUrl] = useState('')
  console.log('path', path);

	// const getCachedImageUrl = async () => {
	// 	if (!path) return
	// 	const cachedUrl = await AsyncStorage.getItem(path)
	// 	if (cachedUrl) {
	// 		setImageUrl(cachedUrl)
	// 	} else {
	// 		const { data, error } = await client.storage
	// 			.from('item-images')
	// 			.createSignedUrl(path, 60 * 60, {
	// 				transform: {
	// 					width: 300,
	// 					height: 300,
	// 				},
	// 			})
	// 		if (!error && data?.signedUrl) {
	// 			setImageUrl(data.signedUrl)
	// 			await AsyncStorage.setItem(path, data.signedUrl)
	// 		}
	// 	}
	// }

	// useEffect(() => {
	// 	getCachedImageUrl()
	// }, [])

	return (
		<>
			{path ? (
				<Image source={{ uri: path }} {...imageProps} />
			) : (
				<Image source={require('@/src/assets/no_image_dark.png')} {...imageProps} />
			)}
		</>
	)

}

export default RemoteImage
