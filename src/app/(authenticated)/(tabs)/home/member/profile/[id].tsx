import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'
import Container from '@/src/components/Container'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'
import { useSearchParams } from 'expo-router/build/hooks'

const MemberProfileScreen = () => {
	const { id: idString } = useLocalSearchParams()
	const searchParams = useSearchParams()
	const folderIdString = searchParams.get('folderId')

	const [isErrorInput, setIsErrorInput] = useState(false)
	const router = useRouter()

	const user_id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	const folder_id = parseFloat(
		folderIdString
			? typeof folderIdString === 'string'
				? folderIdString
				: folderIdString[0]
			: ''
	)

	const user = useAccount()
		.folders.find(folder => folder.id === folder_id)
		?.members.find(member => member.id === user_id)

	const [email, setEmail] = useState(user?.email || '')
	const [roles, setRoles] = useState(
		user?.roles || {
			isView: false,
			isAddItem: false,
			isDeleteItem: false,
			isEdit: false,
			isCanInvite: false,
			isAdmin: false,
		}
	)
	if (!user_id) {
		;<View className='flex-1 justify-center items-center'>
			<Text className='font-bold'>Failed to fetch</Text>
		</View>
	}

	const { handleUpdateMember, handleDeleteMember } = useAccount()

	const updateMember = () => {
		handleUpdateMember({
			folderId: folder_id,
			email,
			roles: roles,
			id: user_id,
		})
		router.back()
	}

	const deleteMember = () => {
		handleDeleteMember({ folderId: folder_id, id: user_id })
		router.back()
	}

	return (
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
			<View className='mx-4 mt-2 flex-1 justify-between'>
				<View className='flex flex-col'>
					<CustomInput
						label={'Email'}
						name={email}
						setName={setEmail}
						isError={isErrorInput}
						containerStyle='mb-4'
					/>
					<Text className='font-lexend_light text-white text-2xl mb-1'>
						Permissions:
					</Text>
					<RectangleCheckBox
						text='View'
						isActive={roles.isView}
						onClick={() => setRoles({ ...roles, isView: !roles.isView })}
						isIcon={true}
						icon={require('@/src/assets/icons/member/isView_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
					<RectangleCheckBox
						text='Edit'
						isActive={roles.isEdit}
						onClick={() => setRoles({ ...roles, isEdit: !roles.isEdit })}
						isIcon={true}
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
						isIcon={true}
						icon={require('@/src/assets/icons/member/isDeleteItem_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
					<RectangleCheckBox
						text='Create'
						isActive={roles.isAddItem}
						onClick={() => setRoles({ ...roles, isAddItem: !roles.isAddItem })}
						isIcon={true}
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
						isIcon={true}
						icon={require('@/src/assets/icons/member/isCanInvite_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
				</View>
				<View className='flex flex-row  my-4'>
					<CustomButton
						text='Delete'
						onClick={deleteMember}
						styleContainer={` mx-0 flex-1 mr-2`}
						isActive={!!email && !roles.isAdmin}
						disabled={roles.isAdmin}
					/>
					<CustomButton
						text='Apply'
						onClick={updateMember}
						styleContainer={` mx-0 flex-1 ml-2`}
						isActive={!!email}
					/>
				</View>
			</View>
		</Container>
	)
}

export default MemberProfileScreen
