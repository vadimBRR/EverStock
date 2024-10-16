import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import Container from '../../components/Container'
import CustomButton from '../../components/CustomButton'
import CustomInput from '../../components/CustomInput'
import { useOAuth, useSignIn, useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { useAuthService } from '@/src/services/authService'
// import { supabase } from '../../lib/supabase'

export default function SignUpScreen() {
	const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  
  const { signUpWithEmail, verifyEmailCode, signInWithOAuth } = useAuthService();
  const router = useRouter();

  
  const validateData = () => {
    if (!email || !password || !name) {
      Alert.alert('Error', 'Please fill all fields');
      return false;
    }
    return true;
  };


  const onSignUpPress = async () => {
    if (!validateData()) return;
    setIsLoading(true);
    try {
      const res =  await signUpWithEmail(email, password, name);
      setPendingVerification(true);
      
    } catch (error) {
      console.log("Error:");
      console.log(error);
      Alert.alert('Error', typeof error === 'string' ? error : "An error occurred. Please try again.");
      
    }
    setIsLoading(false);
  };

  const onPressVerify = async () => {
    setIsLoading(true);
    try {
      await verifyEmailCode(code);
      router.replace('/(authorization)/completed_auth');
    } catch (error) {
      Alert.alert('Error', typeof error === 'string' ? error : "An error occurred. Please try again.")
    }finally{
      setIsLoading(false);
    }

    
  };

	
	return (
		<Container>
			<View className='flex-1 items-center justify-end mb-10 mx-[33px]'>
				<View className='flex items-center justify-center mb-[70px]'>
					<Text className='font-lexend_semibold text-[32px]'>Welcome!</Text>
					<View className='flex flex-row'>
						<Text className='font-lexend_semibold text-[32px]'>to </Text>
						<Text className='font-lexend_semibold text-[32px] text-main_light'>
							EverStock
						</Text>
					</View>
				</View>

				{!pendingVerification && (
					<View className='w-full'>
						<View className='w-full mb-2'>
							<CustomInput label='Full name' name={name} setName={setName} />
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
							<CustomButton
								text='Sign up'
								onClick={onSignUpPress}
								disabled={isLoading}
                styleContainer='m-0'
							/>
						</View>
            </View>
        )}
        {pendingVerification && (
          <View className='w-full'>
            <Text className='font-lexend_semibold text-xl'>Verification Code</Text>
            <Text className='font-lexend_semibold text-lg text-gray'>We have sent the verification code to your email address</Text>
					<View className='w-full mt-[30px] '>
						<CustomInput
							label='Code'
							name={code}
							setName={setCode}
							containerStyle=''
						/>

						<CustomButton text='Verify Email' onClick={onPressVerify} styleContainer='my-[30px] mx-0'/>
					</View>
          </View>
          
				)}

						<View className='w-full'>
							<View className='w-full bg-black/20 h-[1px]' />
							<TouchableOpacity
								className='bg-white w-full my-[30px]'
								onPress={() => signInWithOAuth('oauth_google')}
							>
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
									Already have an account?{' '}
								</Text>
                <TouchableOpacity onPress={() => router.back()}>

								<Text className='font-lexend_semibold text-[18px] mb-[1px]'>
									Sign in
								</Text>
                </TouchableOpacity>
							</View>
						</View>
				
			</View>
		</Container>
	)
}
