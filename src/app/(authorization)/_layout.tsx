import { View, Text } from 'react-native'
import React from 'react'
import { Redirect, Stack } from 'expo-router'
// import { useAuth } from '../../providers/AuthProvider'
import Loading from '../../components/Loading'
import * as SystemUI from 'expo-system-ui'

export default function AuthLayout() {
  // const { session, isLoading } = useAuth()
  // if(isLoading) return <Loading/>
  // if(session) return <Redirect href="/(tabs)/home" />
  SystemUI.setBackgroundColorAsync("#1C1A1A")
  return (

    <Stack screenOptions={{headerShown: false}}>
      {/* <Stack.Screen name="index" /> */}
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="completed_auth" />
      <Stack.Screen name="reset_password" />
      <Stack.Screen name="sign-up" options={{headerShown: true, title: '',headerStyle: { backgroundColor: 'transparent' },
					headerShadowVisible: false,
					headerTransparent: true}}/>
    </Stack>
  )
}