import React, { useState, useEffect, useMemo } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'
import CardMember from '@/src/components/home/member/CardMember'
import { Feather, Ionicons } from '@expo/vector-icons'
import CardItem from '@/src/components/home/item/CardItem'
import { ScrollView } from 'react-native-gesture-handler'
import { useGetFoldersWithItems } from '@/src/api/folder'
import { useGetWarehouseUsers } from '@/src/api/users'

const ViewSettingsScreen = () => {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0])
	const router = useRouter()

	const {
		transactionSettings,
		handleUpdateTransactionSettings,
		deleteFilterMemberId,
		deleteFilterItemId,
	} = useAccount()

	const [settings, setSettings] = useState(transactionSettings)
	const { data: folders = [] } = useGetFoldersWithItems()

	const folder = folders!.find(f => f.id === id)
	const allItems = folder?.items || []

	const { data: warehouseUsers = [] } = useGetWarehouseUsers(id)

	const selectedMembers = useMemo(() => {
		return warehouseUsers.filter(m => settings.membersId.includes(m.id as any))
	}, [warehouseUsers, settings.membersId])

	const selectedItems = useMemo(() => {
		return allItems.filter(i => settings.itemsId.includes(i.id))
	}, [allItems, settings.itemsId])

	const sortOptions = ['item name', 'member name', 'last updated']
	const actions: ['Created', 'Edited', 'Deleted', 'Reverted'] = [
		'Created',
		'Edited',
		'Deleted',
		'Reverted',
	]

	useEffect(() => {
		setSettings(transactionSettings)
	}, [transactionSettings])

	const applySettings = () => {
		handleUpdateTransactionSettings(settings)
		router.back()
	}

	const handleOpenChooseMember = () => {
		router.push(`/analytics/history/choose_member?id=${id}`)
	}

	const handleOpenChooseItem = () => {
		router.push(`/analytics/history/choose_item?id=${id}`)
	}

	const handleToggleSortBy = (sortBy: string) => {
		setSettings(prev =>
			prev.sortBy === sortBy
				? { ...prev, isAsc: !prev.isAsc }
				: { ...prev, sortBy, isAsc: true }
		)
	}

	const handleToggleActions = (
		action: 'Created' | 'Edited' | 'Deleted' | 'Reverted'
	) => {
		const key =
			action === 'Created'
				? 'isCreated'
				: action === 'Edited'
				? 'isEdited'
				: action === 'Deleted'
				? 'isDeleted'
				: 'isReverted'

		setSettings(prev => ({
			...prev,
			actions: {
				...prev.actions,
				[key]: !prev.actions[key],
			},
		}))
	}

	const defaultSettings = {
		sortBy: 'last updated',
		isAsc: true,
		membersId: [],
		itemsId: [],
		actions: {
			isCreated: true,
			isEdited: true,
			isDeleted: true,
			isReverted: true,
		},
	}

	const handleReset = () => {
		setSettings(defaultSettings)
	}

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'View Settings',
					headerStyle: { backgroundColor: '#242121' },
					headerTintColor: '#fff',
					headerRight: () => (
						<View className='flex-row gap-5'>
							{JSON.stringify(settings) !== JSON.stringify(defaultSettings) && (
								<TouchableOpacity onPress={handleReset}>
									<Ionicons name='refresh' size={24} color='white' />
								</TouchableOpacity>
							)}
							<TouchableOpacity onPress={applySettings}>
								<Ionicons name='checkmark' size={24} color='white' />
							</TouchableOpacity>
						</View>
					),
				}}
			/>
			<View className='mx-4 mt-2 flex-1 justify-between'>
				<ScrollView showsVerticalScrollIndicator={false}>
					{/* SORTING */}
					<Text className='font-lexend_light text-white text-2xl mb-2'>
						Sort By:
					</Text>
					{sortOptions.map(option => (
						<RectangleCheckBox
							key={option}
							text={option.charAt(0).toUpperCase() + option.slice(1)}
							isActive={settings.sortBy === option}
							onClick={() => handleToggleSortBy(option)}
							isIcon={settings.sortBy === option}
							icon={
								settings.sortBy === option && settings.isAsc
									? require('@/src/assets/icons/arrow_up.png')
									: require('@/src/assets/icons/arrow_down.png')
							}
							styleContainer='items-start m-0 p-2 px-4 mb-2'
							customBg='dark_gray'
							imageStyle='w-4 h-4 aspect-square'
						/>
					))}

					{/* ACTIONS */}
					<Text className='font-lexend_light text-white text-2xl mb-2'>
						To show:
					</Text>
					{actions.map(option => (
						<RectangleCheckBox
							key={option}
							text={option}
							isActive={settings.actions[`is${option}`]}
							onClick={() => handleToggleActions(option)}
							styleContainer='items-start m-0 p-2 px-4 mb-2'
							customBg='dark_gray'
							imageStyle='w-4 h-4 aspect-square'
						/>
					))}

					{/* MEMBERS */}
					<Text className='font-lexend_light text-white text-2xl mb-2'>
						Filter by:
					</Text>
					{selectedMembers.length === 0 ? (
						<TouchableOpacity
							onPress={handleOpenChooseMember}
							className='bg-dark_gray w-full p-2 rounded-lg mb-2'
						>
							<Text className='font-lexend_semibold text-white text-center text-xl'>
								Choose Member
							</Text>
						</TouchableOpacity>
					) : (
						<View>
							<View className='flex-row justify-between items-end mx-2 mb-2'>
								<Text className='font-lexend_regular text-white text-xl mb-1'>
									Member
								</Text>
								<View className='flex-row gap-2'>
									<TouchableOpacity
										className='bg-dark_gray p-1 px-3 rounded-lg'
										onPress={() => setSettings({ ...settings, membersId: [] })}
									>
										<Text className='text-white text-lg'>Reset</Text>
									</TouchableOpacity>
									<TouchableOpacity
										className='bg-dark_gray p-2 rounded-lg'
										onPress={handleOpenChooseMember}
									>
										<Feather name='plus' size={20} color='white' />
									</TouchableOpacity>
								</View>
							</View>
							{selectedMembers.map(user => (
								<View key={user.id} className='relative z-0'>
									<CardMember
										data={user}
										folderId={id}
										isPressable={false}
										isIcons={false}
									/>
									<TouchableOpacity
										className='absolute top-[17px] right-5 p-2 border border-white rounded-xl'
										onPress={() => deleteFilterMemberId(user.id as any)}
									>
										<Ionicons name='trash-outline' size={20} color='white' />
									</TouchableOpacity>
								</View>
							))}
						</View>
					)}

					{/* ITEMS */}
					{selectedItems.length === 0 ? (
						<TouchableOpacity
							onPress={handleOpenChooseItem}
							className='bg-dark_gray w-full p-2 rounded-lg mb-2'
						>
							<Text className='font-lexend_semibold text-white text-center text-xl'>
								Choose Item
							</Text>
						</TouchableOpacity>
					) : (
						<View>
							<View className='flex-row justify-between items-end mx-2 mb-2 mt-2'>
								<Text className='font-lexend_regular text-white text-xl mb-1'>
									Item
								</Text>
								<View className='flex-row gap-2'>
									<TouchableOpacity
										className='bg-dark_gray p-1 px-3 rounded-lg'
										onPress={() => setSettings({ ...settings, itemsId: [] })}
									>
										<Text className='text-white text-lg'>Reset</Text>
									</TouchableOpacity>
									<TouchableOpacity
										className='bg-dark_gray p-2 rounded-lg'
										onPress={handleOpenChooseItem}
									>
										<Feather name='plus' size={20} color='white' />
									</TouchableOpacity>
								</View>
							</View>
							{selectedItems.map(item => (
								<View key={item.id} className='relative z-0'>
									<CardItem
										item={item}
										currencyName={item.typeAmount!}
										isPressable={false}
                    isShowWarning={false}
									/>
									<TouchableOpacity
										className='absolute top-[17px] right-5 p-2 border border-white rounded-xl'
										onPress={() => deleteFilterItemId(item.id)}
									>
										<Ionicons name='trash-outline' size={20} color='white' />
									</TouchableOpacity>
								</View>
							))}
						</View>
					)}
				</ScrollView>
			</View>
		</Container>
	)
}

export default ViewSettingsScreen
