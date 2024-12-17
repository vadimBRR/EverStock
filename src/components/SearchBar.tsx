import { View, Text, TextInput, Image } from 'react-native'
import React from 'react'
import { Colors } from '../constants/Colors'

type Props = {
	containerStyle?: string
	search: string
	handleSearch: (value: string) => void
}
export default function SearchBar({
	containerStyle,
	search,
	handleSearch,
}: Props) {
	return (
		<View
			className={` w-4/5 bg-black-800 border border-black/10  flex-row items-center  rounded-[14px] h-[45px] px-2 ${containerStyle}`}
		>
			<Image source={require('@/src/assets/icons/search.png')} />
			<TextInput
				placeholder='Search'
				className='font-poppins_regular ml-1 w-11/12 text-[18px] text-white'
				placeholderTextColor={Colors.dark.gray}
				value={search}
				onChangeText={handleSearch}
				autoCorrect={false}
			/>
		</View>
	)
}
