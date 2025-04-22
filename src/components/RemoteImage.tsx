import { Image } from 'react-native'
import React, { ComponentProps, useEffect, useState } from 'react'
import { client } from '../utils/supabaseClient'
import AsyncStorage from '@react-native-async-storage/async-storage'

type RemoteImageProps = {
	path?: string | null
} & Omit<ComponentProps<typeof Image>, 'source'>

const isLocalOrFullUrl = (uri: string) => {
	return (
		uri.startsWith('file://') ||
		uri.startsWith('content://') ||
		uri.startsWith('http://') ||
		uri.startsWith('https://')
	)
}

const RemoteImage = ({ path, ...imageProps }: RemoteImageProps) => {
	const [imageUrl, setImageUrl] = useState<string | null>(null)

	const getCachedImageUrl = async () => {
		if (!path) return

		if (isLocalOrFullUrl(path)) {
			setImageUrl(path)
			return
		}

		// Supabase image logic
		const cachedUrl = await AsyncStorage.getItem(path)
		if (cachedUrl) {
			setImageUrl(cachedUrl)
		} else {
			const { data, error } = await client.storage
				.from('item-images')
				.createSignedUrl(path, 60 * 60, {
					transform: {
						width: 300,
						height: 300,
					},
				})
			if (!error && data?.signedUrl) {
				setImageUrl(data.signedUrl)
				await AsyncStorage.setItem(path, data.signedUrl)
			}
		}
	}

	useEffect(() => {
		getCachedImageUrl()
	}, [path])

	return (
		<>
			{imageUrl ? (
				<Image source={{ uri: imageUrl }} {...imageProps} />
			) : (
				<Image
					source={require('@/src/assets/no_image_dark.png')}
					{...imageProps}
				/>
			)}
		</>
	)
}

export default RemoteImage
