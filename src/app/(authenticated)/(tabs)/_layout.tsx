import {
	View,
	Text,

} from 'react-native'
import React from 'react'
import { Redirect, Tabs, useSegments } from 'expo-router'
import Container from '../../../components/Container'
import Ionicons from '@expo/vector-icons/Ionicons'
// import { useAuth } from '../../providers/AuthProvider'
import { useModal } from '../../../providers/ModalProvider'
import { Colors } from '@/src/constants/Colors'
// import ModalCreateDebt from '@/src/components/debts/ModalCreateDebt'
import * as SystemUI from 'expo-system-ui'

export default function TabsLayout() {
	// const { isSignedIn} = useAuth()
  SystemUI.setBackgroundColorAsync("#1C1A1A")

	const {handleOpen} = useModal()
  
	// if(!isSignedIn) return <Redirect href="/(authorization)/sign-in" />
  const segments = useSegments();

  const hide = segments.includes("create") || segments.includes("account")  || segments.includes("choose_type") || segments.includes("edit") || segments.includes("[id]") && segments.includes("item")
  console.log(segments);
	return (
		<Container isPadding={false}>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: false,
          
					tabBarStyle: {
            display: hide ? "none" : "flex",
						// position: 'absolute',  
						backgroundColor: '#242121',
						height: 65,
            paddingTop: 10,
						// alignItems: 'center',
						// justifyContent: 'center',
            borderColor: '#272424',
						// borderRadius: 20,
						// 			bottom: 10,
						// 			left: 16,
						// 			right: 16,
						// 			elevation: 0,
					},
				}}
			>
				<Tabs.Screen
					name='home'
					options={{
						tabBarIcon: ({ focused }) => (
							<View className='items-center w-20'>
								<Ionicons
									name={focused ? 'home' : 'home-outline'}
									color={focused ? Colors.light.tabIconSelected : Colors.light.tabIconDefault}
									size={focused ? 30 : 30}
								/>
								<Text className= {`${focused ? ' text-main_light text-lg' : 'text-gray text-sm'}   font-lexend_extralight`}>Home</Text>
							</View>
						),
					}}
				/>

				<Tabs.Screen
					name='profile'
					options={{
						tabBarIcon: ({ focused }) => (
							<View className='items-center w-20'>
								<Ionicons
									name={focused ? 'person' : 'person-outline'}
									color={focused ? Colors.light.tabIconSelected : Colors.light.tabIconDefault}
									size={focused ? 30 : 30}
								/>
								<Text className= {`${focused ? ' text-main_light text-lg' : 'text-gray text-sm'}   font-lexend_extralight`}>Profile</Text>
							</View>
						),
					}}
				/>
			</Tabs>
			
			{/* // <ModalCreateDebt />  */}
		</Container>
	)
}
