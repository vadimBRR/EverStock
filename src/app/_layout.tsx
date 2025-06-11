import 'react-native-url-polyfill/auto'

import React, { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as Font from 'expo-font'
import { PaperProvider } from 'react-native-paper'
import Loading from '../components/Loading'
import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { SupabaseProvider } from '../providers/SupabaseProvider'
import * as NavigationBar from 'expo-navigation-bar'
import ModalProvider from '../providers/ModalProvider'
import QueryProvider from '../providers/QueryProvider'
import AccountProvider from '../providers/AccountProvider'
import * as SystemUI from 'expo-system-ui'
import Toast from 'react-native-toast-message'
import { toastConfig } from '../utils/toastConfig'
import { View } from 'react-native'

const tokenCache = {
	async getToken(key: string) {
		try {
			const item = await SecureStore.getItemAsync(key)
			if (item) console.log(`${key} was used 🔐 \n`)
			return item
		} catch (error) {
			console.error('SecureStore get item error: ', error)
			await SecureStore.deleteItemAsync(key)
			return null
		}
	},
	async saveToken(key: string, value: string) {
		try {
			return SecureStore.setItemAsync(key, value)
		} catch (err) {
			return
		}
	},
}

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
if (!publishableKey) {
	throw new Error(
		'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env'
	)
}

const InitialLayout = () => {
	const [fontsLoaded, setFontsLoaded] = useState(false)
	const router = useRouter()
	const { isLoaded, isSignedIn } = useAuth()
	const segments = useSegments()

	// SystemUI.setBackgroundColorAsync('#1C1A1A')
  useEffect(() => {
		SystemUI.setBackgroundColorAsync('#1C1A1A')
	}, [])
	useEffect(() => {
		NavigationBar.setBackgroundColorAsync('#242121')
		NavigationBar.setButtonStyleAsync('dark')

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
		if (!isLoaded || !fontsLoaded) return

		console.log('isSignedIn:', isSignedIn)
		const inAuthGroup = segments[0] === '(authenticated)'

		if (isSignedIn && !inAuthGroup) {
			console.log('Navigating to home...')
			router.replace('/(authenticated)/(tabs)/home/folder')
		} else if (!isSignedIn) {
			console.log('Navigating to login...')
			router.replace('/')
		}
	}, [isLoaded, isSignedIn, fontsLoaded])

	if (!fontsLoaded || !isLoaded) {
		return <Loading />
	}

	return (
		<SupabaseProvider>
			<AccountProvider>
				<Stack
					screenOptions={{
						headerShown: false,
						contentStyle: { backgroundColor: '#1C1A1A' },
						animation: 'fade_from_bottom',
						animationDuration: 500,
					}}
				>
					<Stack.Screen name='index' />
					<Stack.Screen name='(authorization)' />
					<Stack.Screen name='(authenticated)' />
					<Stack.Screen name='oauth-native-callback' />
				</Stack>
			</AccountProvider>
		</SupabaseProvider>
	)
}

const RootLayoutNav = () => {
  useEffect(() => {
		SystemUI.setBackgroundColorAsync('#1C1A1A')
    console.log("ui color changed");
	}, [])
	return (
		<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
			<ClerkLoaded>
				<QueryProvider>
					<ModalProvider>
						<PaperProvider>
							<View style={{ flex: 1, backgroundColor: '#1C1A1A' }}>
								<InitialLayout />
								<Toast config={toastConfig} />
							</View>
						</PaperProvider>
					</ModalProvider>
				</QueryProvider>
			</ClerkLoaded>
		</ClerkProvider>
	)
}

export default RootLayoutNav
