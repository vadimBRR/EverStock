import { View } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import { useGetUserById } from '@/src/api/users'
import { useSupabase } from '@/src/providers/SupabaseProvider'
import Toast from 'react-native-toast-message'

export default function AccountScreen() {
	const { data: userInfo } = useGetUserById()
	const { updateUserInfo } = useSupabase()

	const [firstName, setFirstName] = useState('')
	const [lastName, setLastName] = useState('')
	const [email, setEmail] = useState('')
	const [initialValues, setInitialValues] = useState({
		firstName: '',
		lastName: '',
	})

	useEffect(() => {
		if (userInfo) {
			setFirstName(userInfo.full_name?.split(' ')[0] || '')
			setLastName(userInfo.full_name?.split(' ')[1] || '')
			setEmail(userInfo.email || '')
			setInitialValues({
				firstName: userInfo.full_name?.split(' ')[0] || '',
				lastName: userInfo.full_name?.split(' ')[1] || '',
			})
		}
	}, [userInfo])

	const handleUpdateProfile = async () => {
		const full_name = `${firstName.trim()} ${lastName.trim()}`.trim()

		const res = await updateUserInfo?.({ full_name })

		if (res) {
			Toast.show({
				type: 'success',
				text1: 'Profile updated',
			})
			setInitialValues({ firstName, lastName })
		} else {
			Toast.show({
				type: 'error',
				text1: 'Failed to update profile',
			})
		}
	}

	const isChanged =
		firstName.trim() !== initialValues.firstName.trim() ||
		lastName.trim() !== initialValues.lastName.trim()

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Account',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
					headerTitleAlign: 'center',
				}}
			/>
			<View className='flex-col justify-between flex-1 mb-6'>
				<View>
					<CustomInput
						label='Email'
						name={email}
						setName={() => {}}
						containerStyle='mb-2'
						editable={false}
					/>
					<CustomInput
						label='First name'
						name={firstName}
						setName={setFirstName}
						containerStyle='mb-2'
					/>
					<CustomInput
						label='Last name'
						name={lastName}
						setName={setLastName}
						containerStyle='mb-2'
					/>
				</View>
				<CustomButton
					text='Apply'
					disabled={!isChanged}
					onClick={handleUpdateProfile}
				/>
			</View>
		</Container>
	)
}
