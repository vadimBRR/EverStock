import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Redirect } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'
import Loading from '../components/Loading'

export default function SSOCallback() {
	const { isSignedIn, isLoaded, getToken, userId } = useAuth()
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		if (!isLoaded) return

		console.log('OAuth Callback: Checking user state...')
		console.log('isSignedIn:', isSignedIn, 'userId:', userId)

		if (isSignedIn && userId) {
			setTimeout(async () => {
				const token = await getToken({ template: 'supabase' })
				console.log('Updated Supabase token:', token)
				setIsReady(true)
			}, 1000)
		}
	}, [isSignedIn, userId, isLoaded])

	if (!isReady) {
		return <Loading />
	}

	return <Redirect href='/(authenticated)/(tabs)/home/folder' />
}
