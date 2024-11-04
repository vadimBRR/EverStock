import { Image } from 'react-native'
import React, { ComponentProps, useEffect, useMemo, useState } from 'react'
import { client } from '../utils/supabaseClient'

type RemoteImageProps = {
	path?: string | null
	// fallback: string;
} & Omit<ComponentProps<typeof Image>, 'source'>

// const RemoteImage = ({ path, fallback, ...imageProps }: RemoteImageProps) => {
const RemoteImage = ({ path, ...imageProps }: RemoteImageProps) => {
	const [imageUrl, setImageUrl] = useState('')

	useEffect(() => {
		if (!path) return
		const readImageUrl = async () => {
			const { data, error } = await client.storage
				.from('item-images')
				.createSignedUrl(path, 60 * 60, {
					transform: {
						width: 300,
						height: 300,
					},
				})
			if (!error) {
				setImageUrl(data.signedUrl)
			}
			console.log(data)
			console.log(error)
		}

    readImageUrl();
	}, [])

	return (
		<>
			{imageUrl ? (
				<Image source={{ uri: imageUrl }} {...imageProps} />
			) : (
				<Image source={require('@/src/assets/no_image.png')} {...imageProps} />
			)}
		</>
	)

	// return <Image source={{ uri: image || fallback }} {...imageProps} />;
}

export default RemoteImage
