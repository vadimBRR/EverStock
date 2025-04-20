import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Container from '@/src/components/Container'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'
import { useSearchParams } from 'expo-router/build/hooks'
import {
	useGetWarehouseUsers,
	useUpdateWarehouseMember,
	useDeleteWarehouseMember,
} from '@/src/api/users'
import { showSuccess, showError } from '@/src/utils/toast'
import { useRolesStore } from '@/src/store/useUserRoles'

const MemberProfileScreen = () => {
	const { id: idString } = useLocalSearchParams()
	const searchParams = useSearchParams()
	const folderIdString = searchParams.get('folderId')
	const router = useRouter()

	const folder_id = parseFloat(folderIdString || '')
	const user_id = idString ? String(idString) : ''

	const { data: members = [] } = useGetWarehouseUsers(folder_id)
	const member = members.find(m => m.id === user_id)

	const [email, setEmail] = useState(member?.email || '')
	const [roles, setRoles] = useState(
		member?.roles || {
			isView: false,
			isAddItem: false,
			isDeleteItem: false,
			isEdit: false,
			isCanInvite: false,
			isAdmin: false,
			isManager: false,
		}
	)
	const [isErrorInput, setIsErrorInput] = useState(false)
  const myRoles = useRolesStore(state => state.roles)
	const canManaged = myRoles?.isManager || myRoles?.isAdmin && !roles.isAdmin

	useEffect(() => {
		if (member) {
			setEmail(member.email)
			setRoles(member.roles)
		}
	}, [member])

	const { mutate: updateMember } = useUpdateWarehouseMember()
	const { mutate: deleteMember } = useDeleteWarehouseMember()

	const update = () => {
		updateMember(
			{
				folderId: folder_id,
				userId: user_id,
				roles,
			},
			{
				onSuccess: () => {
					showSuccess('Roles updated successfully')
					router.back()
				},
				onError: () => showError('Failed to update roles'),
			}
		)
	}

	const remove = () => {
		deleteMember(
			{
				folderId: folder_id,
				userId: user_id,
			},
			{
				onSuccess: () => {
					showSuccess('Member deleted')
					router.back()
				},
				onError: () => showError('Failed to delete member'),
			}
		)
	}

	if (!member) {
		return (
			<View className='flex-1 justify-center items-center'>
				<Text className='font-bold text-white'>User not found</Text>
			</View>
		)
	}

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Member',
					headerStyle: { backgroundColor: '#242121' },
					headerTintColor: '#fff',
				}}
			/>
			<View className='mx-4 mt-2 flex-1 justify-between'>
				<View className='flex flex-col'>
					<CustomInput
						label={'Email'}
						name={email}
						setName={() => {}}
						isError={isErrorInput}
						containerStyle='mb-4'
            editable={true}
					/>
					<Text className='font-lexend_light text-white text-2xl mb-1'>
						Permissions:
					</Text>
					<RectangleCheckBox
						text='View'
						isActive={roles.isView}
						isIcon={true}
						icon={require('@/src/assets/icons/member/isView_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
					<RectangleCheckBox
						text='Edit'
						isActive={roles.isEdit}
						onClick={() => {
							if (canManaged) setRoles({ ...roles, isEdit: !roles.isEdit })
						}}
						isIcon={true}
						icon={require('@/src/assets/icons/member/isEdit_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
					<RectangleCheckBox
						text='Delete'
						isActive={roles.isDeleteItem}
						onClick={() => {
							if (canManaged)
								setRoles({ ...roles, isDeleteItem: !roles.isDeleteItem })
						}}
						isIcon={true}
						icon={require('@/src/assets/icons/member/isDeleteItem_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
					<RectangleCheckBox
						text='Create'
						isActive={roles.isAddItem}
						onClick={() => {
							if (canManaged)
								setRoles({ ...roles, isAddItem: !roles.isAddItem })
						}}
						isIcon={true}
						icon={require('@/src/assets/icons/member/isAddItem_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
					<RectangleCheckBox
						text='Invite'
						isActive={roles.isCanInvite}
						onClick={() => {
							if (canManaged)
								setRoles({ ...roles, isCanInvite: !roles.isCanInvite })
						}}
						isIcon={true}
						icon={require('@/src/assets/icons/member/isCanInvite_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
					<RectangleCheckBox
						text='Manager'
						isActive={roles.isManager}
						onClick={() => {
							if (canManaged)
								setRoles({ ...roles, isManager: !roles.isManager })
						}}
						isIcon={true}
						icon={require('@/src/assets/icons/member/isManager_white.png')}
						styleContainer='items-start m-0 p-2 px-4 mb-2'
						customBg='dark_gray'
					/>
				</View>
				{canManaged && (
					<View className='flex flex-row my-4'>
						<CustomButton
							text='Delete'
							onClick={remove}
							styleContainer='mx-0 flex-1 mr-2'
							isActive={!!email }
						/>
						<CustomButton
							text='Apply'
							onClick={update}
							styleContainer='mx-0 flex-1 ml-2'
							isActive={!!email}
						/>
					</View>
				)}
			</View>
		</Container>
	)
}

export default MemberProfileScreen
