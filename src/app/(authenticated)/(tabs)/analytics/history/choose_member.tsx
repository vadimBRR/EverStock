import { View } from 'react-native'
import React, { useMemo, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import {
	FlatList,
	ScrollView,
	TouchableOpacity,
} from 'react-native-gesture-handler'
import CardMember from '@/src/components/home/member/CardMember'
import CustomButton from '@/src/components/CustomButton'
import { useGetWarehouseUsers } from '@/src/api/users'

const ChooseMemberScreen = () => {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	const router = useRouter()

	const { transactionSettings, handleUpdateTransactionSettings } = useAccount()
	const [choseMember, setChoseMember] = useState(transactionSettings.membersId)
	const [search, setSearch] = useState('')

	const { data: warehouseUsers = [] } = useGetWarehouseUsers(id)

	const filteredMembers = useMemo(() => {
		if (!search) return warehouseUsers
		const lower = search.toLowerCase()
		return warehouseUsers.filter(
			member =>
				member.fullName.toLowerCase().includes(lower) ||
				member.email.toLowerCase().includes(lower)
		)
	}, [warehouseUsers, search])

	const handleSearch = (value: string) => {
		setSearch(value)
	}

	const handleApply = () => {
		handleUpdateTransactionSettings({
			...transactionSettings,
			membersId: choseMember,
		})
		router.back()
	}

	const toggleMember = (memberId: number) => {
		if (choseMember.includes(memberId)) {
			setChoseMember(choseMember.filter(id => id !== memberId))
		} else {
			setChoseMember([...choseMember, memberId])
		}
	}

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Choose member',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
				}}
			/>

			<View className='flex-1 mx-4 mt-2 mb-5'>
				<ScrollView>
					<SearchBar
						search={search}
						handleSearch={handleSearch}
						containerStyle='w-full mb-4'
					/>

					<FlatList
						scrollEnabled={false}
						data={filteredMembers}
						keyExtractor={member => member.id.toString()}
						renderItem={({ item }) => (
							<TouchableOpacity onPress={() => toggleMember(item.id as any)}>
								<CardMember
									data={item}
									folderId={id}
									containerStyle={`${
										choseMember.includes(item.id as any)
											? 'border-1 border-white bg-dark_gray'
											: ''
									}`}
									isPressable={false}
								/>
							</TouchableOpacity>
						)}
					/>
				</ScrollView>
				<CustomButton text='Apply' onClick={handleApply} />
			</View>
		</Container>
	)
}

export default ChooseMemberScreen
