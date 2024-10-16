import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import React from 'react'

type Props = {
	text?: string
	onClick?: () => void
	styleContainer?: string
	styleText?: object
	isIcon?: boolean
  imageStyle?: string
  disabled?: boolean
  icon?: ImageSourcePropType
  isActive?:boolean
}
export default function CustomButton({
	text,
	onClick,
	styleContainer,
	styleText,
  imageStyle,
	isIcon,
  disabled=false,
  icon,
  isActive = true

}: Props) {
	return (
		<TouchableOpacity
			className={` rounded-xl items-center justify-center py-3 mx-7 px-4 relative ${disabled || !isActive ? 'bg-gray' : 'bg-main_light'} ${styleContainer}`}
			onPress={onClick}
      disabled={disabled}
		>
			<Text
				className={`font-lexend_semibold text-[19px] text-white ${styleText}`}
			>
				{text}
			</Text>
			{isIcon && (
        
          icon ? (
            <Image
              source={icon}
              className={`absolute right-4 ${imageStyle}`}
            />
          ) : (
            <Image
              source={require('../assets/icons/arrow-right.png')}
              style={{ width: 38, height: 27 }}
              className='absolute right-4'
            />
          )
        
				
			)}
		</TouchableOpacity>
	)
}
