import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'

type Props = {
	text?: string
	onClick?: () => void
	styleContainer?: string
	styleText?: object
	isIcon?: boolean
  disabled?: boolean
}
export default function CustomButton({
	text,
	onClick,
	styleContainer,
	styleText,
	isIcon,
  disabled=false

}: Props) {
	return (
		<TouchableOpacity
			className={`bg-main_light rounded-xl items-center justify-center py-3 mx-7 relative ${styleContainer}`}
			onPress={onClick}
      disabled={disabled}
		>
			<Text
				className={`font-lexend_semibold text-[19px] text-white ${styleText}`}
			>
				{text}
			</Text>
			{isIcon && (
				<Image
					source={require('../assets/icons/arrow-right.png')}
					style={{ width: 38, height: 27 }}
					className='absolute right-4'
				/>
			)}
		</TouchableOpacity>
	)
}
