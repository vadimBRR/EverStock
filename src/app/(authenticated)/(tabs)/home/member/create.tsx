import {
	View,
	Text,
	FlatList,
	Keyboard,
	TouchableWithoutFeedback,
} from 'react-native'
import React, { useState } from 'react'
import { Stack, useRouter } from 'expo-router'
import Container from '@/src/components/Container'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'
import { useSearchParams } from 'expo-router/build/hooks'
import { useAddWarehouseMember, useGetAllUsers } from '@/src/api/users'
import { showSuccess, showError } from '@/src/utils/toast'
import { ScrollView } from 'react-native-gesture-handler'

const CreateMemberScreen = () => {
	const searchParams = useSearchParams()
	const idString = searchParams.get('id')
	const router = useRouter()

	const folder_id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

	const [email, setEmail] = useState('')
	const [isFocused, setIsFocused] = useState(false)
	const [isErrorInput, setIsErrorInput] = useState(false)
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const [roles, setRoles] = useState({
		isView: true,
		isAddItem: false,
		isDeleteItem: false,
		isEdit: false,
		isCanInvite: false,
		isAdmin: false,
		isManager: false,
	})

	const { mutateAsync, isPending } = useAddWarehouseMember()
	const { data: allUsers = [] } = useGetAllUsers()

	const filteredSuggestions = allUsers.filter(
		user =>
			user.email?.toLowerCase().includes(email.toLowerCase()) &&
			user.email !== email
	)

	const handleCreateMember = async () => {
		setErrorMessage(null)

		if (!email) {
			setIsErrorInput(true)
			setErrorMessage('Email is required.')
			showError('Email is required.')
			return
		}

		try {
			await mutateAsync({
				folderId: folder_id,
				email,
				roles,
				permissions: [],
			})

			showSuccess('Member added successfully 🎉')
			router.back()
		} catch (error: any) {
			console.error('Error adding member:', error.message)
			setIsErrorInput(true)
			const message = error.message || 'Something went wrong.'
			setErrorMessage(message)
			showError('Failed to add member', message)
		}
	}

	if (!folder_id) {
		return (
			<View className='flex-1 justify-center items-center'>
				<Text className='font-bold text-white'>Failed to fetch</Text>
			</View>
		)
	}

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<Container isPadding={false}>
				<Stack.Screen
					options={{
						headerShown: true,
						title: 'Member',
						headerStyle: {
							backgroundColor: '#242121',
						},
						headerTintColor: '#fff',
					}}
				/>
				<View className='mx-4 mt-2 flex-1 relative'>
					<View className='relative z-10'>
						<CustomInput
							label={'Email'}
							name={email}
							setName={setEmail}
							isError={isErrorInput}
							containerStyle='mb-2'
							onFocus={() => setIsFocused(true)}
							onBlur={() => setTimeout(() => setIsFocused(false), 150)}
						/>

						{/* 🔍 Autocomplete список з FlatList */}
						{isFocused && filteredSuggestions.length > 0 && (
  <View
    className='absolute w-full bg-dark_gray rounded-lg shadow-lg z-50'
    style={{
      top: 65,
      maxHeight: 200, // важливо
      elevation: 10,
    }}
  >
    <ScrollView
      keyboardShouldPersistTaps='handled'
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {filteredSuggestions.slice(0, 20).map((user, index) => (
        <View key={index}>
          <Text
            className='text-white py-2 px-3'
            onPress={() => {
              setEmail(user.email)
              setIsErrorInput(false)
              setIsFocused(false)
              Keyboard.dismiss()
            }}
          >
            {user.email} {user.full_name ? `- ${user.full_name}` : ''}
          </Text>
          {index !== filteredSuggestions.length - 1 && (
            <View className='h-px bg-neutral-600 opacity-40' />
          )}
        </View>
      ))}
    </ScrollView>
  </View>
)}

					</View>

					{errorMessage && (
						<Text className='text-red-500 mb-4 mt-2'>{errorMessage}</Text>
					)}

					<ScrollView keyboardShouldPersistTaps='handled'>
						<Text className='font-lexend_light text-white text-2xl mb-1'>
							Permissions:
						</Text>

						<RectangleCheckBox
							text='View'
							isActive={roles.isView}
							isIcon
							icon={require('@/src/assets/icons/member/isView_white.png')}
							styleContainer='items-start m-0 p-2 px-4 mb-2'
							customBg='dark_gray'
						/>
						<RectangleCheckBox
							text='Edit'
							isActive={roles.isEdit}
							onClick={() => setRoles({ ...roles, isEdit: !roles.isEdit })}
							isIcon
							icon={require('@/src/assets/icons/member/isEdit_white.png')}
							styleContainer='items-start m-0 p-2 px-4 mb-2'
							customBg='dark_gray'
						/>
						<RectangleCheckBox
							text='Delete'
							isActive={roles.isDeleteItem}
							onClick={() =>
								setRoles({ ...roles, isDeleteItem: !roles.isDeleteItem })
							}
							isIcon
							icon={require('@/src/assets/icons/member/isDeleteItem_white.png')}
							styleContainer='items-start m-0 p-2 px-4 mb-2'
							customBg='dark_gray'
						/>
						<RectangleCheckBox
							text='Create'
							isActive={roles.isAddItem}
							onClick={() =>
								setRoles({ ...roles, isAddItem: !roles.isAddItem })
							}
							isIcon
							icon={require('@/src/assets/icons/member/isAddItem_white.png')}
							styleContainer='items-start m-0 p-2 px-4 mb-2'
							customBg='dark_gray'
						/>
						<RectangleCheckBox
							text='Invite'
							isActive={roles.isCanInvite}
							onClick={() =>
								setRoles({ ...roles, isCanInvite: !roles.isCanInvite })
							}
							isIcon
							icon={require('@/src/assets/icons/member/isCanInvite_white.png')}
							styleContainer='items-start m-0 p-2 px-4 mb-2'
							customBg='dark_gray'
						/>
						<RectangleCheckBox
							text='Manager'
							isActive={roles.isManager}
							onClick={() => {
								if (!roles.isAdmin) {
									setRoles({ ...roles, isManager: !roles.isManager })
								}
							}}
							isIcon
							icon={require('@/src/assets/icons/member/isManager_white.png')}
							styleContainer='items-start m-0 p-2 px-4 mb-2'
							customBg='dark_gray'
						/>

						<CustomButton
							text='Add Member'
							onClick={handleCreateMember}
							styleContainer='my-4 mx-0'
							isActive={!!email && !isPending}
						/>
					</ScrollView>
				</View>
			</Container>
		</TouchableWithoutFeedback>
	)
}

export default CreateMemberScreen
