// import React, { useEffect, useState } from 'react'
// import { Stack, useRouter, useSegments } from 'expo-router'
// import * as Font from 'expo-font'
// import { PaperProvider } from 'react-native-paper'
// import * as NavigationBar from 'expo-navigation-bar'
// import ModalProvider from '../providers/ModalProvider'
// import QueryProvider from '../providers/QueryProvider'
// import Loading from '../components/Loading'
// import AccountProvider, { useAccount } from '../providers/AccountProvider'
// import * as SystemUI from 'expo-system-ui'

// const InitialLayout = () => {
// 	const [fontsLoaded, setFontsLoaded] = useState(false)
// 	const router = useRouter()
// 	const { isAuthenticated } = useAccount()
// 	const segments = useSegments()

// 	SystemUI.setBackgroundColorAsync('#1C1A1A')

// 	useEffect(() => {
// 		NavigationBar.setBackgroundColorAsync('#123456')
// 		NavigationBar.setButtonStyleAsync('dark')
// 		// NavigationBar.setVisibilityAsync('hidden')

// 		const loadFonts = async () => {
// 			await Font.loadAsync({
// 				'LexendDeca-Regular': require('../../assets/fonts/LexendDeca-Regular.ttf'),
// 				'LexendDeca-SemiBold': require('../../assets/fonts/LexendDeca-SemiBold.ttf'),
// 				'LexendDeca-Light': require('../../assets/fonts/LexendDeca-Light.ttf'),
// 				'LexendDeca-ExtraLight': require('../../assets/fonts/LexendDeca-ExtraLight.ttf'),
// 				'Poppins-Bold': require('../../assets/fonts/Poppins-Bold.ttf'),
// 				'Poppins-Light': require('../../assets/fonts/Poppins-Light.ttf'),
// 				'Poppins-Medium': require('../../assets/fonts/Poppins-Medium.ttf'),
// 				'Poppins-Regular': require('../../assets/fonts/Poppins-Regular.ttf'),
// 				'Poppins-Thin': require('../../assets/fonts/Poppins-Regular.ttf'),
// 			})
// 			setFontsLoaded(true)
// 		}

// 		loadFonts()
// 	}, [])

// 	useEffect(() => {
// 		if (!fontsLoaded) return

// 		const inAuthGroup = segments[0] === '(authenticated)'
// 		if (isAuthenticated && !inAuthGroup) {
// 			router.replace('/(authenticated)/(tabs)/home/folder')
// 		} else if (!isAuthenticated) {
// 			router.replace('/')
// 		}
// 	}, [isAuthenticated, fontsLoaded])

// 	if (!fontsLoaded) {
// 		return <Loading />
// 	}

// 	return (
// 		<Stack
// 			screenOptions={{
// 				headerShown: false,
// 				contentStyle: { backgroundColor: '#1C1A1A' },
//         animation: 'fade_from_bottom',
//         animationDuration: 500
        
// 			}}
// 		>
// 			<Stack.Screen name='index' />
// 			<Stack.Screen name='(authorization)' />
// 			<Stack.Screen name='(authenticated)' />
// 			<Stack.Screen name='oauth-native-callback' />
// 		</Stack>
// 	)
// }

// const RootLayoutNav = () => {
// 	return (
// 		<QueryProvider>
// 			{/* <ActionSheetProvider> */}
// 			<AccountProvider>
// 				<ModalProvider>
// 					<PaperProvider>
// 						<InitialLayout />
// 					</PaperProvider>
// 				</ModalProvider>
// 			</AccountProvider>
// 			{/* </ActionSheetProvider> */}
// 		</QueryProvider>
// 	)
// }

// export default RootLayoutNav

import React, { useEffect, useState } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import * as Font from 'expo-font'
import { PaperProvider } from 'react-native-paper'
import Loading from '../components/Loading'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import * as SecureStore from 'expo-secure-store'
import { ClerkProvider, ClerkLoaded, useAuth } from '@clerk/clerk-expo'
import { SupabaseProvider } from '../providers/SupabaseProvider'
import * as NavigationBar from 'expo-navigation-bar'
import ModalProvider from '../providers/ModalProvider'
import QueryProvider from '../providers/QueryProvider'
import AccountProvider from '../providers/AccountProvider'
import * as SystemUI from 'expo-system-ui'

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

  SystemUI.setBackgroundColorAsync('#1C1A1A')

  useEffect(() => {
    NavigationBar.setBackgroundColorAsync('#123456')
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
  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <QueryProvider>
          <ModalProvider>
            <PaperProvider>
              <InitialLayout />
            </PaperProvider>
          </ModalProvider>
        </QueryProvider>
      </ClerkLoaded>
    </ClerkProvider>
  )
}

export default RootLayoutNav

