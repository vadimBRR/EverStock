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
import * as SystemUI from 'expo-system-ui';

type Props = {
	children: React.ReactNode
	isPadding?: boolean
}
export default function Container({ children, isPadding = true }: Props) {
  SystemUI.setBackgroundColorAsync('#1C1A1A');

	return (
		<TouchableWithoutFeedback
			onPress={() => {
        // NavigationBar.setVisibilityAsync('hidden')
        Keyboard.dismiss()
      }}
		>
			<View className='flex-1 bg-bg'>
				{/* <ImageBackground
					source={require('../assets/bg.jpg')}
					className={`flex-1 `}
					style={{
						paddingTop:
							Platform.OS === 'android' && isPadding
								? StatusBar.currentHeight
								: 0,
					}}
				> */}
					{children}
				{/* </ImageBackground> */}
        <StatusBar barStyle="light-content" backgroundColor="#242121" translucent />

			</View>

		</TouchableWithoutFeedback>
	)
}
