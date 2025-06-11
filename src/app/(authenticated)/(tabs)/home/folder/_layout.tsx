import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import * as SystemUI from 'expo-system-ui'

export default function FolderLayout() {
  useEffect(() => {
		SystemUI.setBackgroundColorAsync('#1C1A1A')
    console.log("ui color changed");
	}, [])
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
