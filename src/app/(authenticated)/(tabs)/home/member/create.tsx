import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'
import Container from '@/src/components/Container'
import CustomInput from '@/src/components/CustomInput'
import CustomButton from '@/src/components/CustomButton'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'
import { useSearchParams } from 'expo-router/build/hooks'

const CreateMemberScreen = () => {
  const searchParams = useSearchParams(); 
  const idString = searchParams.get("id");
  const [isErrorInput, setIsErrorInput] = useState(false)
  const router = useRouter();
  
	const folder_id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

	const [email, setEmail] = useState('')
	const [roles, setRoles] = useState({
		isView: false,
		isAddItem: false,
		isDeleteItem: false,
		isEdit: false,
		isCanInvite: false,
		isAdmin: false,
	})
	if (!folder_id) {
		;<View className='flex-1 justify-center items-center'>
			<Text className='font-bold'>Failed to fetch</Text>
		</View>
	}

  const {handleAddMember} = useAccount()

  const handleCreateMember = () => {
    console.log("heree first");
    handleAddMember({folderId: folder_id,email, role: roles})
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
          <Text className='font-lexend_light text-white text-2xl mb-1'>Permissions:</Text>
          <RectangleCheckBox
            text="View"
            isActive={roles.isView}
            onClick={() => setRoles({...roles, isView: !roles.isView})}
            isIcon={true}
            icon={require('@/src/assets/icons/member/isView_white.png')}
            styleContainer='items-start m-0 p-2 px-4 mb-2'
            customBg='dark_gray'
            />
          <RectangleCheckBox
            text="Edit"
            isActive={roles.isEdit}
            onClick={() => setRoles({...roles, isEdit: !roles.isEdit})}
            isIcon={true}
            icon={require('@/src/assets/icons/member/isEdit_white.png')}
            styleContainer='items-start m-0 p-2 px-4 mb-2'
            customBg='dark_gray'
            />
          <RectangleCheckBox
            text="Delete"
            isActive={roles.isDeleteItem}
            onClick={() => setRoles({...roles, isDeleteItem: !roles.isDeleteItem})}
            isIcon={true}
            icon={require('@/src/assets/icons/member/isDeleteItem_white.png')}
            styleContainer='items-start m-0 p-2 px-4 mb-2'
            customBg='dark_gray'
            />
          <RectangleCheckBox
            text="Create"
            isActive={roles.isAddItem}
            onClick={() => setRoles({...roles, isAddItem: !roles.isAddItem})}
            isIcon={true}
            icon={require('@/src/assets/icons/member/isAddItem_white.png')}
            styleContainer='items-start m-0 p-2 px-4 mb-2'
            customBg='dark_gray'
            />
          <RectangleCheckBox
            text="Invite"
            isActive={roles.isCanInvite}
            onClick={() => setRoles({...roles, isCanInvite: !roles.isCanInvite})}
            isIcon={true}
            icon={require('@/src/assets/icons/member/isCanInvite_white.png')}
            styleContainer='items-start m-0 p-2 px-4 mb-2'
            customBg='dark_gray'
            />

					
				</View>
				<CustomButton
					text='Create Folder'
					onClick={handleCreateMember}
					styleContainer={`my-4 mx-0`}
					// disabled={!folderName}
					isActive={!!email}
				/>
			</View>
		</Container>
	)
}

export default CreateMemberScreen
