import React from 'react'
import { Stack } from 'expo-router'
import * as SystemUI from 'expo-system-ui'

export default function AuthLayout() {
  SystemUI.setBackgroundColorAsync("#1C1A1A")
  return (

        <Stack
          screenOptions={{
            headerShown: false,
            animationDuration: 500,
            contentStyle: { backgroundColor: '#1C1A1A' },
          }}
        >
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