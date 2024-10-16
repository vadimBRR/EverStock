import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as Font from 'expo-font'
import { PaperProvider } from 'react-native-paper'
// import { ActionSheetProvider } from '@expo/react-native-action-sheet'
import Loading from '../components/Loading'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { SupabaseProvider } from '../providers/SupabaseProvider'
import * as NavigationBar from 'expo-navigation-bar'
import ModalProvider from '../providers/ModalProvider'
import QueryProvider from '../providers/QueryProvider'

const tokenCache = {
	async getToken(key: string) {
		try {
			const item = await SecureStore.getItemAsync(key)
			if (item) {
				console.log(`${key} was used 🔐 \n`)
			} else {
				console.log('No values stored under key: ' + key)
			}
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
  console.log('isSignedIn before:', isSignedIn) ;
	useEffect(() => {
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
		if (!isLoaded || !fontsLoaded) return

		console.log('isSignedIn:', isSignedIn)
		const inAuthGroup = segments[0] === '(authenticated)'
		if (isSignedIn && !inAuthGroup) {
      console.log("here1");
			router.replace('/(authenticated)/(tabs)/home/folder')
      // router.replace('/(authorization)/completed_auth')
		} else if (!isSignedIn) {
      console.log("here2");
			router.replace('/')
		}
	}, [isLoaded, isSignedIn, fontsLoaded])

	if (!fontsLoaded || !isLoaded) {
		return <Loading />
	}

	console.log('isSignedIn after:', isSignedIn)
	console.log('isLoading after:', isLoaded)
	console.log(segments)
	return (
		<SupabaseProvider>
			<Stack screenOptions={{ headerShown: false }}>
				<Stack.Screen name='index' />
				<Stack.Screen name='(authorization)' />
				<Stack.Screen name='(authenticated)' />
				<Stack.Screen name='oauth-native-callback' />
			</Stack>
		</SupabaseProvider>
	)
}

const RootLayoutNav = () => {
	return (
		<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
			<ClerkLoaded>
				<QueryProvider>
					{/* <ActionSheetProvider> */}
						<ModalProvider>
							<PaperProvider>
								<InitialLayout />
							</PaperProvider>
						</ModalProvider>
					{/* </ActionSheetProvider> */}
				</QueryProvider>
			</ClerkLoaded>
		</ClerkProvider>
	)
}

export default RootLayoutNav
