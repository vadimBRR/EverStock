import React from 'react'
import { Stack } from 'expo-router'

export default function ItemLayout() {
	return (
		<Stack
			screenOptions={{
				animationDuration: 500,
				contentStyle: { backgroundColor: '#1C1A1A' },
			}}
		></Stack>
	)
}
