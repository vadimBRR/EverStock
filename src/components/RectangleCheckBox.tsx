import {
	View,
	Text,
	TouchableOpacity,
	Image,
	ImageSourcePropType,
} from 'react-native'
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
	isActive?: boolean
	isLoading?: boolean
  customBg?: string
}
export default function RectangleCheckBox({
	text,
	onClick,
	styleContainer,
	styleText,
	imageStyle,
	isIcon,
	disabled = false,
	icon,
	isActive = true,
	isLoading = false,
  customBg=''
}: Props) {
	if (isLoading) {
		return (
			<View
				className={` rounded-xl items-center justify-center py-3 mx-7 px-4 relative border${
					disabled || !isActive ? 'bg-black-600 border-white' : `bg-dark_gray border-dark_gray`
				} ${styleContainer}`}
			>
				<Text
					className={`font-lexend_semibold text-[19px] text-white ${styleText}`}
				>
					Loading...
				</Text>
			</View>
		)
	}
	return (
		<TouchableOpacity
			className={` rounded-xl items-center justify-center py-3 mx-7 px-4 relative border ${
				disabled || !isActive ? 'bg-black-600  border-[#B6B6B6]' : 'bg-[#858585] border-[#858585]'
			} ${styleContainer}`}
			onPress={onClick}
			disabled={disabled}
		>
			<Text
				className={`font-lexend_semibold text-[19px] text-white/80 ${styleText}`}
			>
				{text}
			</Text>
			{isIcon &&
				(icon ? (
					<Image source={icon} className={`absolute right-4 w-8 h-8 opacity-80 ${imageStyle} `} />
				) : (
					<Image
						source={require('../assets/icons/arrow-right.png')}
						style={{ width: 38, height: 27 }}
						className=' absolute right-4'
					/>
				))}
		</TouchableOpacity>
	)
}
