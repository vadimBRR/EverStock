import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import Container from '@/src/components/Container'
import {  useRouter } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import { Ionicons } from '@expo/vector-icons'

export default function ResetPassword() {
	const [emailAddress, setEmailAddress] = useState('')
	const [password, setPassword] = useState('')
	const [code, setCode] = useState('')
	const [successfulCreation, setSuccessfulCreation] = useState(false)
	const router = useRouter()

	return (
		<Container>
			<View className='absolute left-5 top-10'>
				<Ionicons
					name='arrow-back'
					size={24}
					color='white'
					onPress={() => router.back()}
				/>
			</View>
			<View className='flex-1 items-center justify-center mb-10 mx-[33px]'>
				<View className='flex items-center justify-center mb-[70px]'>
					<Text className='font-lexend_semibold text-[32px] text-white'>Welcome!</Text>
					<View className='flex flex-row'>
						<Text className='font-lexend_semibold text-[32px] text-white'>to </Text>
						<Text className='font-lexend_semibold text-[32px] text-main_light'>
							EverStock
						</Text>
					</View>
				</View>

				{!successfulCreation && (
					<View className='w-full'>
						<View className='w-full mb-2'>
							<CustomInput
								label='Email'
								name={emailAddress}
								setName={setEmailAddress}
							/>
						</View>

						<View className='w-full my-[30px]'>
							<CustomButton
								text='Send Reset Email'
								onClick={() => {}}
								styleContainer='m-0'
							/>
						</View>
					</View>
				)}
				{successfulCreation && (
					<View className='w-full'>
						<Text className='font-lexend_semibold text-xl'>
							Verification Code
						</Text>
						<Text className='font-lexend_semibold text-lg text-gray'>
							We have sent the verification code to your email address
						</Text>
						<View className='w-full mt-[30px] '>
							<CustomInput
								label='Code'
								name={code}
								setName={setCode}
								containerStyle='mb-2'
							/>
							<CustomInput
								label='New Password'
								name={password}
								setName={setPassword}
								containerStyle=''
								secureTextEntry
							/>

							<CustomButton
								text='Set New Password'
								onClick={() => {}}
								styleContainer='my-[30px] mx-0'
							/>
						</View>
					</View>
				)}
			</View>
		</Container>
	)
}
