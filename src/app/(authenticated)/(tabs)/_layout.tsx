import {
	View,
	Text,
	SafeAreaView,
	Platform,
	StatusBar,
	TouchableOpacity,
} from 'react-native'
import React from 'react'
import { Redirect, Tabs } from 'expo-router'
import Container from '../../../components/Container'
import Ionicons from '@expo/vector-icons/Ionicons'
// import { useAuth } from '../../providers/AuthProvider'
import Loading from '../../../components/Loading'
import { useModal } from '../../../providers/ModalProvider'
// import ModalCreateDebt from '@/src/components/debts/ModalCreateDebt'

export default function TabsLayout() {
	// const { session, isLoading } = useAuth()
	const {handleOpen} = useModal()
  
	// if(isLoading) return <Loading/>
	// if(!session) return <Redirect href="/(auth)/sign-in" />

	return (
		<Container>
			<Tabs
				screenOptions={{
					headerShown: false,
					tabBarShowLabel: false,
					tabBarStyle: {
						position: 'absolute',
						backgroundColor: '#5F33E1',
						height: 65,
						alignItems: 'center',
						justifyContent: 'center',
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
							<View className='items-center '>
								<Ionicons
									name={focused ? 'home' : 'home-outline'}
									color={focused ? 'white' : '#AF99F0'}
									size={focused ? 36 : 24}
								/>
								{/* <Text className= {`${focused ? 'text-[#F02A4B]' : 'gray'} text-sm mt-[4]`}>Home</Text> */}
							</View>
						),
					}}
				/>

				<Tabs.Screen
					name='profile'
					options={{
						tabBarIcon: ({ focused }) => (
							<View className='items-center '>
								<Ionicons
									name={focused ? 'person' : 'person-outline'}
									color={focused ? 'white' : '#AF99F0'}
									size={focused ? 36 : 24}
								/>
								{/* <Text className= {`${focused ? 'text-[#F02A4B]' : 'gray'} text-sm mt-[4]`}>Home</Text> */}
							</View>
						),
					}}
				/>
			</Tabs>
			<TouchableOpacity
				onPress={handleOpen}
				style={{
					position: 'absolute',
					bottom: 6,
					alignSelf: 'center',
					zIndex: 1,
					height: 54,
					width: 54,
					borderRadius: 32,
					// backgroundColor: '#ffffff',
					borderColor: '#ffffff44',
					borderWidth: 2,
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Ionicons name='add' color='#ffffff' size={36} />
			</TouchableOpacity>
			{/* <ModalCreateDebt /> */}
		</Container>
	)
}
