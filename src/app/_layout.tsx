import React, { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as Font from 'expo-font'
import { PaperProvider } from 'react-native-paper'
import * as NavigationBar from 'expo-navigation-bar'
import ModalProvider from '../providers/ModalProvider'
import QueryProvider from '../providers/QueryProvider'
import Loading from '../components/Loading'
import AccountProvider, { useAccount } from '../providers/AccountProvider'
import * as SystemUI from 'expo-system-ui'

const InitialLayout = () => {
	const [fontsLoaded, setFontsLoaded] = useState(false)
	const router = useRouter()
	const { isAuthenticated } = useAccount()
	const segments = useSegments()

	SystemUI.setBackgroundColorAsync('#1C1A1A')

	useEffect(() => {
		NavigationBar.setBackgroundColorAsync('#123456')
		NavigationBar.setButtonStyleAsync('dark')
		// NavigationBar.setVisibilityAsync('hidden')

		const loadFonts = async () => {
			await Font.loadAsync({
				'LexendDeca-Regular': require('../../assets/fonts/LexendDeca-Regular.ttf'),
				'LexendDeca-SemiBold': require('../../assets/fonts/LexendDeca-SemiBold.ttf'),
				'LexendDeca-Light': require('../../assets/fonts/LexendDeca-Light.ttf'),
				'LexendDeca-ExtraLight': require('../../assets/fonts/LexendDeca-ExtraLight.ttf'),
				'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
				'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf'),
				'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
				'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
				'Poppins-Thin': require('../../assets/fonts/Poppins-Regular.ttf'),
			})
			setFontsLoaded(true)
		}

		loadFonts()
	}, [])

	useEffect(() => {
		if (!fontsLoaded) return

		const inAuthGroup = segments[0] === '(authenticated)'
		if (isAuthenticated && !inAuthGroup) {
			router.replace('/(authenticated)/(tabs)/home/folder')
		} else if (!isAuthenticated) {
			router.replace('/')
		}
	}, [isAuthenticated, fontsLoaded])

	if (!fontsLoaded) {
		return <Loading />
	}

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: '#1C1A1A' },
        animation: 'fade_from_bottom',
        animationDuration: 500
        
			}}
		>
			<Stack.Screen name='index' />
			<Stack.Screen name='(authorization)' />
			<Stack.Screen name='(authenticated)' />
			<Stack.Screen name='oauth-native-callback' />
		</Stack>
	)
}

const RootLayoutNav = () => {
	return (
		<QueryProvider>
			{/* <ActionSheetProvider> */}
			<AccountProvider>
				<ModalProvider>
					<PaperProvider>
						<InitialLayout />
					</PaperProvider>
				</ModalProvider>
			</AccountProvider>
			{/* </ActionSheetProvider> */}
		</QueryProvider>
	)
}

export default RootLayoutNav
