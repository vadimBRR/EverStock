import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const HistoryLayout = () => {
	return (
		<Stack
			screenOptions={{
				headerShown: false,
				contentStyle: { backgroundColor: '#1C1A1A' },
			}}
		></Stack>
	)
}

export default HistoryLayout
