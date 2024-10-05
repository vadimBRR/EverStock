import {
	View,
	Text,
	ImageBackground,
	StatusBar,
	Platform,
	TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import React, { PropsWithChildren } from 'react'
import * as NavigationBar from 'expo-navigation-bar'

type Props = {
	children: React.ReactNode
	isPadding?: boolean
}
export default function Container({ children, isPadding = true }: Props) {
	return (
		<TouchableWithoutFeedback
			onPress={() => {NavigationBar.setVisibilityAsync('hidden')
        console.log("hd");
        Keyboard.dismiss()
      }}
		>
			<View className='flex-1'>
				<ImageBackground
					source={require('../assets/bg.jpg')}
					className={`flex-1 `}
					style={{
						paddingTop:
							Platform.OS === 'android' && isPadding
								? StatusBar.currentHeight
								: 0,
					}}
				>
					{children}
				</ImageBackground>
			</View>
		</TouchableWithoutFeedback>
	)
}
