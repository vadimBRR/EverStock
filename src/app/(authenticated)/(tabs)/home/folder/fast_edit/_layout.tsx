import { View, Text } from 'react-native'
import React from 'react'

import * as SystemUI from 'expo-system-ui'
import { Stack } from 'expo-router'
const FastEditLayout = () => {
	SystemUI.setBackgroundColorAsync('#1C1A1A')

	return (
		<Stack
			screenOptions={{
				headerShown: false,
				animationDuration: 500,
				contentStyle: { backgroundColor: '#1C1A1A' },
			}}
		></Stack>
	)
}

export default FastEditLayout
