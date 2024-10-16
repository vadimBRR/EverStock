import { View, Text, TextInput, Image } from 'react-native'
import React from 'react'

type Props = {
  containerStyle?: string
  search: string
  handleSearch: (value: string) => void
}
export default function SearchBar({containerStyle, search, handleSearch}:Props) {

	return (
		<View className={`${containerStyle} w-4/5 bg-white border border-black/10 p-2 flex-row items-center  rounded-[14px] h-[45px]`} >
			<Image source={require('@/src/assets/icons/search.png')} />
			<TextInput
				placeholder='Search'
				className='font-poppins_regular ml-1 w-11/12 text-[18px]'
        value={search}
        onChangeText={handleSearch}
        autoCorrect={false}
			/>
		</View>
	)
}
