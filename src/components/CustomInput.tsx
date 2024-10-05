import { View, Text } from 'react-native'
import React from 'react'
import { DefaultTheme, TextInput } from 'react-native-paper'

type Props = {
	name: string
	setName: (projectName: string) => void
	label: string
	containerStyle?: string
	inputStyle?: string
	isMultiline?: boolean
  marginTop?: number
  keyboardType?: 'default' | 'numeric' | 'email-address' 
  secureTextEntry?: boolean
}
export default function CustomInput({
	name,
	setName,
	label,
	containerStyle = '',
	inputStyle = '',
	isMultiline = false,
  marginTop = 0,
  keyboardType = 'default',
  secureTextEntry = false
}: Props) {

  const [borderColor, setBorderColor] = React.useState('border-black/10')
	return (
		<View
			className={`rounded-2xl bg-white border ${borderColor} overflow-hidden  ${containerStyle}`}
		>
			<TextInput
				label={label}
        
				value={name}
				onChangeText={setName}
				className={` bg-white h-[54px] ${inputStyle}`}
				underlineStyle={{
					display: 'none',
				}}
				theme={{
					colors: { text: 'black', primary: 'black' },
					fonts: {
						...DefaultTheme.fonts,
						bodyLarge: {
							fontFamily: 'LexendDeca-Regular', // Ваш кастомний шрифт
						},
					},
				}}
				underlineColor='transparent' // Видалення нижньої лінії в обох станах
				textColor='black' // Колір тексту
				multiline={isMultiline}
        contentStyle={{
          marginTop: marginTop
        }}
        keyboardType={keyboardType}
        onFocus={() => {setBorderColor('border-main_light')}}
        onBlur={() => {setBorderColor('border-black/10')}}
        secureTextEntry={secureTextEntry}

			/>
		</View>
	)
}
