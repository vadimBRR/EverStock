import { View } from 'react-native'
import React, { useEffect } from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'

export default function AccountScreen() {
	const [firstName, setFirstName] = React.useState('')
	const [lastName, setLastName] = React.useState('')
	const [user, setUser] = React.useState<{
		firstName: string
		lastName: string
	}>({ firstName: '', lastName: '' })

	useEffect(() => {
		if (user) {
			setFirstName(user?.firstName || '')
			setLastName(user?.lastName || '')
		}
	}, [user])

	const handleUpdateProfile = async () => {
		if (firstName && firstName !== user?.firstName) {
		

			setUser({ ...user, firstName })
		}
	}

	// if(isLoading) return <Loading/>

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
					{/* <CustomInput label='Email' name={email} setName={setEmail} /> */}
				</View>
				<CustomButton
					text='Apply'
					disabled={
						firstName.trim() === user?.firstName?.trim() &&
						lastName.trim() === user?.lastName?.trim()
					}
					onClick={handleUpdateProfile}
				/>
			</View>
		</Container>
	)
}
