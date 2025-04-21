import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons'
import { DefaultTheme, TextInput } from 'react-native-paper'

const Counter = ({
	quantity,
	item_id,
	setQuantity,
	type,
}: {
	quantity: string
	item_id: number
	setQuantity: (quantity: number) => void
	type: string
}) => {
	return (
		<View className='flex flex-row justify-between mb-2'>
			<TouchableOpacity
				className='h-[54px] w-[54px] flex items-center justify-center rounded-2xl bg-black-600 border border-dark_gray '
				onPress={() => setQuantity(parseInt(quantity) - 1)}
			>
				<AntDesign name='minus' size={24} color='white' />
			</TouchableOpacity>

			<View
				className={`rounded-2xl bg-black-600 border border-dark_gray overflow-hidden relative w-1/2  ]`}
			>
				<View className=' '>
					<TextInput
						label={'.'}
						value={quantity + ''}
						onChangeText={text => setQuantity(parseInt(text) || 0)}
						className={`bg-black-600 h-[54px] text-center`}
						underlineStyle={{
							display: 'none',
						}}
						theme={{
							colors: { primary: '#2a2a2a', onSurfaceVariant: '#2a2a2a' },
							fonts: {
								...DefaultTheme.fonts,
								bodyLarge: {
									fontFamily: 'LexendDeca-Regular',
								},
							},
						}}
						underlineColor='transparent'
						textColor='white'
						contentStyle={{
							marginTop: 0,
						}}
						keyboardType={'number-pad'}
						numberOfLines={1}
					/>
				</View>
				<View className='absolute top-2 self-center'>
					<Text className='text-gray font-lexend_regular text-[12px]'>
						{/* {type.charAt(0).toUpperCase() + type.slice(1)}: */}
            Quantity:
					</Text>
				</View>
			</View>
			<TouchableOpacity
				className='h-[54px] w-[54px] flex items-center justify-center rounded-2xl bg-black-600 border border-dark_gray'
				onPress={() => setQuantity(parseInt(quantity) + 1)}
			>
				<AntDesign name='plus' size={24} color='white' />
			</TouchableOpacity>
		</View>
	)
}

export default Counter

