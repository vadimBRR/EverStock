import React, { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
// import { useGetUserById } from '@/src/api/users'
import Loading from '@/src/components/Loading'

export default function Layout() {
  const router = useRouter();
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
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="(tabs)" />
      {/* <Stack.Screen name="choose_currency" /> */}
    </Stack>
  )
}