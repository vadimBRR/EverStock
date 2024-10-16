import { View, Text, Image } from 'react-native'
import React, { useState } from 'react'
import Container from '@/src/components/Container'
import { useSignIn } from '@clerk/clerk-expo'
import { Stack, useRouter } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import { Ionicons } from '@expo/vector-icons'

export default function ResetPassword() {
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();
  const router = useRouter();

  const onRequestReset = async () => {
    try {
      await signIn!.create({
        strategy: 'reset_password_email_code',
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      const messages = err.errors.map((error: any) => error.longMessage).join(', ');
      alert(messages);
    }
  };

  // Reset the password with the code and the new password
  const onReset = async () => {
    try {
      const result = await signIn!.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code,
        password,
      });
      console.log(result);
      alert('Password reset successfully');

      // Set the user session active, which will log in the user automatically
      await setActive!({ session: result.createdSessionId });
    } catch (err: any) {
      alert(err.errors[0].message);
    }
  };
  

	
	return (
		<Container>
      <View className='absolute left-5 top-10'>
        <Ionicons name='arrow-back' size={24} color='black' onPress={() => router.back()} />
      </View>
			<View className='flex-1 items-center justify-center mb-10 mx-[33px]'>
				<View className='flex items-center justify-center mb-[70px]'>
					<Text className='font-lexend_semibold text-[32px]'>Welcome!</Text>
					<View className='flex flex-row'>
						<Text className='font-lexend_semibold text-[32px]'>to </Text>
						<Text className='font-lexend_semibold text-[32px] text-main_light'>
							EverStock
						</Text>
					</View>
				</View>

				{!successfulCreation && (
					<View className='w-full'>
						<View className='w-full mb-2'>
							<CustomInput label='Email' name={emailAddress} setName={setEmailAddress} />
						</View>
						
						<View className='w-full my-[30px]'>
							<CustomButton
								text='Send Reset Email'
								onClick={onRequestReset}
                styleContainer='m-0'
							/>
						</View>
            </View>
        )}
        {successfulCreation && (
          <View className='w-full'>
            <Text className='font-lexend_semibold text-xl'>Verification Code</Text>
            <Text className='font-lexend_semibold text-lg text-gray'>We have sent the verification code to your email address</Text>
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

						<CustomButton text='Set New Password' onClick={onReset} styleContainer='my-[30px] mx-0'/>
					</View>
          </View>
          
				)}

				
			</View>
		</Container>
  )
}