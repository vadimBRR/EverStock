import {
	View,
	StatusBar,
	TouchableWithoutFeedback,
	Keyboard,
} from 'react-native'
import React from 'react'
import * as SystemUI from 'expo-system-ui'

type Props = {
	children: React.ReactNode
	isPadding?: boolean
	container_style?: string
}
export default function Container({
	children,
	isPadding = true,
	container_style,
}: Props) {
	SystemUI.setBackgroundColorAsync('#1C1A1A')

	return (
		<TouchableWithoutFeedback
			onPress={() => {
				Keyboard.dismiss()
			}}
		>
			<View className={`flex-1 bg-bg ${container_style}`}>
				{children}
				<StatusBar
					barStyle='light-content'
					backgroundColor='#242121'
					translucent
				/>
			</View>
		</TouchableWithoutFeedback>
	)
}
