import { View, Text, Image } from 'react-native'
import React, { useEffect } from 'react'
import Container from '../components/Container'
import * as NavigationBar from 'expo-navigation-bar'
import CustomButton from '../components/CustomButton'
import { Redirect, useRouter } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import * as SystemUI from 'expo-system-ui'

export default function RootScreen() {
	const router = useRouter()
	const { isSignedIn } = useAuth()

	useEffect(() => {
		NavigationBar.setBackgroundColorAsync('#242121')
		SystemUI.setBackgroundColorAsync('#1C1A1A')
	}, [])

	if (isSignedIn) {
		return <Redirect href='/(authenticated)/(tabs)/home/folder' />
	}

	const handlePress = () => {
		router.push('/(authorization)/sign-in')
	}

	return (
		<Container>
			<View className='flex-1 '>
				<Image
					source={require('../assets/present_image.png')}
					className='h-[400] w-[100%] mt-10'
				/>
				<View>
					<View className='px-12 mt-16'>
						<Text className='font-lexend_semibold text-[32px] text-center text-white'>
							Organize Your Inventory Fast
						</Text>
						<Text className='font-lexend_regular text-gray text-[14px] text-center mt-[19] mb-8'>
							Keep all your stock organized in one place. Whether managing large
							or small inventories, track it effortlessly with easy-to-use tools
						</Text>
					</View>
					<CustomButton
						text="Let's Start"
						isIcon={true}
						onClick={handlePress}
					/>
				</View>
			</View>
		</Container>
	)
}
