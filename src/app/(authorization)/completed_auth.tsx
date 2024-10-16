import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import { useAuth, useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useAuthService } from '@/src/services/authService'
import Loading from '@/src/components/Loading'
// import { supabase } from '../../lib/supabase'

export default function CompletedAuthScreen() {
	const router = useRouter()
	const handleContinue = () => {
		router.replace('/')
	}
	return (
		<Container>
			<View className='flex-1 items-center justify-center mb-10 mx-[33px]'>
				<View className='flex items-center justify-center mb-[50px]'>
					
					<Image source={require('@/src/assets/done.png')} />
				</View>

				<View className='w-full'>
					<Text className='font-lexend_semibold text-2xl text-center'>
						Success!
					</Text>
					<Text className='font-lexend_semibold text-lg text-gray mx-4  mt-2 text-center mb-[80px]'>
						Congratulations! You have been successfully authenticated
					</Text>
					<View className='w-full'>
						<CustomButton
							text='Continue'
							onClick={handleContinue}
							styleContainer='my-[px] mx-0'
						/>
					</View>
				</View>
			</View>
		</Container>
	)
}
