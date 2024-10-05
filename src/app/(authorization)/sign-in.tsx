import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import { router } from 'expo-router'
import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { useAuthService } from '@/src/services/authService'
// import useWarmUpBrowser from '@/src/hooks/useWarmUpBrowser'
// import { supabase } from '../../lib/supabase'

export default function SignInScreen() {
  // useWarmUpBrowser();
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { signInWithEmail, signInWithOAuth } = useAuthService();

  const onSignInEmailPress = async () => {
    setIsLoading(true);
    await signInWithEmail(email, password);
    setIsLoading(false);
  };
	return (
		<Container>
			<View className='flex-1 items-center justify-end mb-10 mx-[33px]'>
				<View className='flex items-center justify-center mb-[70px]'>
					<Text className='font-lexend_semibold text-[32px]'>Welcome!</Text>
					<View className='flex flex-row'>
						<Text className='font-lexend_semibold text-[32px]'>to </Text>
						<Text className='font-lexend_semibold text-[32px] text-main_light'>EverStock</Text>
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
				<View className='w-full my-[30px]'>
					<CustomButton text='Log in' onClick={onSignInEmailPress} disabled={isLoading} styleContainer='m-0'/>
				</View>
				<View className='w-full bg-black/20 h-[1px]' />
				<TouchableOpacity className='bg-white w-full my-[30px]' onPress={() => signInWithOAuth('oauth_google')}>
					<View className='border-black/5 border py-[15px] flex items-center justify-center'>
						<View className='absolute left-3'>
							<Image
								source={require('../../assets/icons/google.png')}
								className=''
							/>
						</View>
              <Text className='font-lexend_regular text-[16px] text-black_light'>
                Log in with Google
              </Text>

					</View>
				</TouchableOpacity>
				<View className='flex-row items-center justify-center'>
					<Text className='font-lexend_regular text-[16px]'>
						Don’t have an account?{' '}
					</Text>

          <TouchableOpacity onPress={() => {router.push("/(authorization)/sign-up")}}>
            <Text className='font-lexend_semibold text-[18px] mb-[1px]'>
              Sign up
            </Text>

          </TouchableOpacity>
				</View>
			</View>
		</Container>
	)
}
