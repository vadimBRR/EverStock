import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import { router } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'

export default function SignInScreen() {
	const [password, setPassword] = useState('')
	const [email, setEmail] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const { handleSignIn } = useAccount()

	const signInWithEmail = (email: string) => {
		handleSignIn({ email })
		router.replace('/')
	}

	const signInWithOAuth = async (provider: string) => {
		//

		handleSignIn({ email: 'admin@gmail.com' })
		router.replace('/')
	}

	const validateData = () => {
		if (!email || !password) {
			Alert.alert('Error', 'Please fill all fields')
			return false
		}
		return true
	}

	const onSignInEmailPress = async () => {
		if (!validateData()) return
		setIsLoading(true)
		signInWithEmail(email)
		setIsLoading(false)
	}
	return (
		<Container>
			<View className='flex-1 items-center justify-end mb-10 mx-[33px]'>
				<View className='flex items-center justify-center mb-[20px]'>
					<Text className='font-lexend_semibold text-[32px] text-white'>
						Welcome!
					</Text>
					<View className='flex flex-row'>
						<Text className='font-lexend_semibold text-[32px] text-white'>
							to{' '}
						</Text>
						<Text className='font-lexend_semibold text-[32px] text-main_light'>
							EverStock
						</Text>
					</View>
				</View>
				<View className='w-full mb-2'>
					<CustomInput
						label='Email'
						name={email}
						setName={setEmail}
						keyboardType='email-address'
					/>
				</View>
				<View className='w-full'>
					<CustomInput
						label='Password'
						name={password}
						setName={setPassword}
						secureTextEntry
					/>
				</View>
				<View className='w-full my-[30px] mb-[15px]'>
					<CustomButton
						text='Log in'
						onClick={onSignInEmailPress}
						disabled={isLoading}
						styleContainer='m-0'
					/>
				</View>
				<TouchableOpacity
					onPress={() => router.push('/(authorization)/reset_password')}
				>
					<Text className='font-lexend_regular text-[16px] mb-[20px] text-white'>
						Forgot password?
					</Text>
				</TouchableOpacity>
				<View className='w-full bg-dark_gray/20 h-[1px] ' />
				<TouchableOpacity
					className='bg-black-400  w-full my-[30px] rounded-xl overflow-hidden border border-dark_gray'
					onPress={() => signInWithOAuth('oauth_google')}
				>
					<View className='border-black/5 border py-[15px] flex items-center justify-center'>
						<View className='absolute left-3'>
							<Image
								source={require('../../assets/icons/google.png')}
								className=''
							/>
						</View>
						<Text className='font-lexend_regular text-[16px] text-white '>
							Log in with Google
						</Text>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					onPress={() => {
						router.push('/(authorization)/sign-up')
					}}
				>
					<View className='flex-row items-center justify-center'>
						<Text className='font-lexend_regular text-[16px] text-white'>
							Don’t have an account?{' '}
						</Text>

						<Text className='font-lexend_semibold text-[18px] mb-[1px] text-white'>
							Sign up
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		</Container>
	)
}
