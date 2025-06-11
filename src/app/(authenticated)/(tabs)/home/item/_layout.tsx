import React, { useEffect } from 'react'
import { Stack } from 'expo-router'
import * as SystemUI from 'expo-system-ui'

export default function ItemLayout() {
  useEffect(() => {
      SystemUI.setBackgroundColorAsync('#1C1A1A')
      console.log("ui color changed");
    }, [])
	return (
    
		<Stack
			screenOptions={{
				animationDuration: 500,
				contentStyle: { backgroundColor: '#1C1A1A' },
			}}
		></Stack>
	)
}
