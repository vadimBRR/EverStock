import React, { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
// import { useGetUserById } from '@/src/api/users'
import Loading from '@/src/components/Loading'
import * as SystemUI from 'expo-system-ui'

export default function Layout() {
  const router = useRouter();
    SystemUI.setBackgroundColorAsync("#1C1A1A")
  
	// const { data, isLoading } = useGetUserById()
  const segments = useSegments();
  // useEffect(() => {
    // if(segments[0] === 'choose_currency' && !isLoading && data && data.currency) {
    //   router.replace('/(authenticated)/(tabs)')
    // }else if(data && !data.currency && !isLoading && segments[0] !== 'choose_currency') {
    //   router.replace('/(authenticated)/choose_currency')
    // }
    
  // },[data, isLoading])
	
  // if(isLoading){
  //   return <Loading/>
  // }
  return (
    <Stack screenOptions={{headerShown: false, contentStyle: { backgroundColor: '#1C1A1A' }}}>
      <Stack.Screen name="(tabs)" />
      {/* <Stack.Screen name="choose_currency" /> */}
    </Stack>
  )
}