import { View, Text, TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import React from 'react'
import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons'

type Props = {
	onPress: () => void
	icon: string
	text: string
}
const OptionSettings = ({ onPress, icon, text }: Props) => {
  const iconMap: {[key: string]: ImageSourcePropType} = {
    delete: require('@/src/assets/icons/item/delete.png'),
    image: require('@/src/assets/icons/item/image.png'),
    history: require('@/src/assets/icons/item/history.png'),
    export: require('@/src/assets/icons/item/export.png'),
    move: require('@/src/assets/icons/item/move.png'),
    clone: require('@/src/assets/icons/item/clone.png'),
  }
	return (
		<View>
			<TouchableOpacity
				className='flex-row items-center py-2'
				onPress={onPress}
			>
				<View className='w-10 flex items-center'>
					{/* {icon === 'history' ? <MaterialCommunityIcons name={icon} size={28} color='white' /> : <EvilIcons name={icon} size={34} color='white' />} */}
					{iconMap[icon]&&
          <Image
          source={iconMap[icon]}
          className='w-6 h-6 aspect-square'
        />}
				</View>

				<Text className='font-lexend_light text-lg  text-white '>{text}</Text>
			</TouchableOpacity>
		</View>
	)
}

export default OptionSettings
