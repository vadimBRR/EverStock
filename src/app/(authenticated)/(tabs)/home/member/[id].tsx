import { View, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as SystemUI from 'expo-system-ui'
import Loading from '@/src/components/Loading'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import { RefreshControl } from 'react-native-gesture-handler'
import CardMember from '@/src/components/home/member/CardMember'
import { useGetWarehouseUsers } from '@/src/api/users'
import { useRolesStore } from '@/src/store/useUserRoles'
import Toast from 'react-native-toast-message'

const MembersScreen = () => {
	const { id: idString } = useLocalSearchParams()
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
		</Container>
	)
}

export default MembersScreen
