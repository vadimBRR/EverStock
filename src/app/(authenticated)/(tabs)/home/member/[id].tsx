import { View, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Stack, useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import * as SystemUI from 'expo-system-ui'
import Loading from '@/src/components/Loading'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import { RefreshControl } from 'react-native-gesture-handler'
import CardMember from '@/src/components/home/member/CardMember'
import { useDeleteWarehouseMember, useGetWarehouseUsers } from '@/src/api/users'
import { useRolesStore } from '@/src/store/useUserRoles'
import Toast from 'react-native-toast-message'
import { useSupabase } from '@/src/providers/SupabaseProvider'
import { TouchableOpacity } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { showError, showSuccess } from '@/src/utils/toast'
import ConfirmDialog from '@/src/components/home/ConfirmDialog'

const MembersScreen = () => {
	const { id: idString } = useLocalSearchParams()
  const navigation = useNavigation()
	const folder_id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

	const router = useRouter()
	const [search, setSearch] = useState('')

	const {
		data = [],
		isLoading,
		refetch,
		isRefetching,
	} = useGetWarehouseUsers(folder_id)

	SystemUI.setBackgroundColorAsync('#1C1A1A')
	const roles = useRolesStore(state => state.roles)
	const [isLeaveVisible, setIsLeaveVisible] = useState(false)

	const { mutate: deleteMember } = useDeleteWarehouseMember()
	const { userId } = useSupabase()

	const openCreateMember = () => {
		if (roles?.isAdmin || roles?.isCanInvite || roles?.isManager) {
			router.push('/(authenticated)/home/member/create?id=' + folder_id)
		} else {
			Toast.show({
				type: 'error',
				text1: 'Permission Denied',
				text2: 'You do not have rights to add members.',
				position: 'top',
			})
		}
	}

	const handleSearch = (value: string) => {
		setSearch(value)
	}

	const onRefresh = useCallback(async () => {
		await refetch()
	}, [])

	const filteredMembers = search
		? data.filter(
				member =>
					member.fullName.toLowerCase().includes(search.toLowerCase()) ||
					member.email.toLowerCase().includes(search.toLowerCase())
		  )
		: data

	if (isLoading) return <Loading />

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Members',
					headerTitleAlign: 'center',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerRight: () =>
						!roles?.isAdmin ? (
							<TouchableOpacity
								onPress={() => setIsLeaveVisible(true)}
								className=' p-1'
							>
								<Ionicons name='exit-outline' size={22} color='white' />
							</TouchableOpacity>
						) : null,

					headerTintColor: '#fff',
				}}
			/>
			<View className='flex-1'>
				<View className='flex-row w-full justify-center my-2'>
					<SearchBar
						containerStyle='mr-2'
						search={search}
						handleSearch={handleSearch}
					/>
					<AddButton handlePressAdd={openCreateMember} />
				</View>

				<FlatList
					className='mx-3 mb-24'
					data={filteredMembers}
					keyExtractor={member => member.id.toString()}
					renderItem={({ item }) => (
						<CardMember key={item.id} data={item} folderId={folder_id} />
					)}
					refreshControl={
						<RefreshControl refreshing={isRefetching} onRefresh={onRefresh} />
					}
				/>
			</View>
			<ConfirmDialog
				isVisible={isLeaveVisible}
				onCancel={() => setIsLeaveVisible(false)}
				onConfirm={() => {
					if (!userId) return
					deleteMember(
						{ folderId: folder_id, userId },
						{
							onSuccess: () => {
								setIsLeaveVisible(false)
								showSuccess('You have left the folder.')
                console.log("byee");
                setTimeout(() => {
                  router.back()
                  router.replace('/(authenticated)/(tabs)/home/folder')
                  router.setParams({})
                  
                }, 300);
							},
							onError: (err: any) => {
								setIsLeaveVisible(false)
								showError('Failed to leave folder', err.message)
							},
						}
					)
				}}
				title='Leave Folder'
				description='Are you sure you want to leave this folder? You will lose access to it.'
				confirmText='Leave'
			/>
		</Container>
	)
}

export default MembersScreen
