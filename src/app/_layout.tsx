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
  console.log("initial layout");
	const [fontsLoaded, setFontsLoaded] = useState(false)
	const router = useRouter()
	const { isAuthenticated } = useAccount()
	const segments = useSegments()
	console.log('isSignedIn before:', isAuthenticated)
  SystemUI.setBackgroundColorAsync("#1C1A1A")

	useEffect(() => {
		NavigationBar.setBackgroundColorAsync('#123456') 
		NavigationBar.setButtonStyleAsync('dark')
		NavigationBar.setVisibilityAsync('hidden')

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

		console.log('isSignedIn:', isAuthenticated)
		const inAuthGroup = segments[0] === '(authenticated)'
		if (isAuthenticated && !inAuthGroup) {
			console.log('here1')
			router.replace('/(authenticated)/(tabs)/home/folder')
		} else if (!isAuthenticated) {
			console.log('here2')
			router.replace('/')
		}
	}, [isAuthenticated, fontsLoaded])

	if (!fontsLoaded) {
		return <Loading />
	}

	console.log('isSignedIn after:', isAuthenticated)
	console.log(segments)
	return (
    
		<Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#1C1A1A' } }}>
			<Stack.Screen name='index' />
			<Stack.Screen name='(authorization)' />
			<Stack.Screen name='(authenticated)' />
			<Stack.Screen name='oauth-native-callback' />
		</Stack>
	)
}

const RootLayoutNav = () => {
  console.log("root layout");
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
