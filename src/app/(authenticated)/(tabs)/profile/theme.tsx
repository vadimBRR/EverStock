import { View, Text } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'

export default function ThemeScreen() {
	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Theme',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
					headerTitleAlign: 'center',
				}}
			/>
			<View className='flex-1 justify-center items-center'>
				<Text className='text-white text-2xl font-lexend_semibold mb-2'>
					Theme Settings
				</Text>
				<Text className='text-gray text-lg font-lexend_light'>
					Coming soon...
				</Text>
			</View>
		</Container>
	)
}
