import { Image } from 'react-native'
import React, { ComponentProps } from 'react'

type RemoteImageProps = {
	path?: string | null
} & Omit<ComponentProps<typeof Image>, 'source'>

const RemoteImage = ({ path, ...imageProps }: RemoteImageProps) => {

	return (
		<>
			{path ? (
				<Image source={{ uri: path }} {...imageProps} />
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
