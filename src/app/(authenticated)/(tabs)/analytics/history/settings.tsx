import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { useAccount } from '@/src/providers/AccountProvider'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'
import CardMember from '@/src/components/home/member/CardMember'
import { Feather, Ionicons } from '@expo/vector-icons'
import CardItem from '@/src/components/home/item/CardItem'
import { ScrollView } from 'react-native-gesture-handler'

const ViewSettingsScreen = () => {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	const router = useRouter()
	const {
		transactionSettings,
		handleUpdateTransactionSettings,
		deleteFilterMemberId,
		deleteFilterItemId,
	} = useAccount()
	const [settings, setSettings] = useState(transactionSettings)
	const sortOptions = ['item name', 'member name', 'last updated']
	const actions: ['Created', 'Edited', 'Deleted', 'Reverted'] = [
		'Created',
		'Edited',
		'Deleted',
		'Reverted',
	]
	React.useEffect(() => {
		setSettings(transactionSettings)
	}, [transactionSettings])

	const users = useAccount()
		.folders.find(folder => folder.id === id)
		?.members.filter(member => settings.membersId.includes(member.id))

	const items = useAccount().items.filter(item =>
		settings.itemsId.includes(item.id)
	)

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
		if (settings.sortBy === sortBy) {
			setSettings({ ...settings, isAsc: !settings.isAsc })
		} else {
			setSettings({ ...settings, sortBy, isAsc: true })
		}
	}

	const handleToggleActions = (
		action: 'Created' | 'Edited' | 'Deleted' | 'Reverted'
	) => {
		const formattedAction:
			| 'isCreated'
			| 'isEdited'
			| 'isDeleted'
			| 'isReverted' =
			action === 'Created'
				? 'isCreated'
				: action === 'Edited'
				? 'isEdited'
				: action === 'Deleted'
				? 'isDeleted'
				: 'isReverted'

		setSettings({
			...settings,
			actions: {
				...settings.actions,
				[formattedAction]: !settings.actions[formattedAction],
			},
		})
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
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
					headerRight: () => {
						return (
							<View className='flex-row gap-5'>
								{JSON.stringify(settings) !==
									JSON.stringify(defaultSettings) && (
									<TouchableOpacity onPress={handleReset} className=''>
										<Ionicons name='refresh' size={24} color='white' />
									</TouchableOpacity>
								)}

								<TouchableOpacity onPress={applySettings} className=''>
									<Ionicons name='checkmark' size={24} color='white' />
								</TouchableOpacity>
							</View>
						)
					},
				}}
			/>
			<View className='mx-4 mt-2 flex-1 justify-between'>
				<ScrollView
					showsHorizontalScrollIndicator={false}
					showsVerticalScrollIndicator={false}
				>
					<Text className='font-lexend_light text-white text-2xl mb-2'>
						Sort By:
					</Text>
					{sortOptions.map((option, index) => (
						<RectangleCheckBox
							key={index}
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
					<Text className='font-lexend_light text-white text-2xl mb-2'>
						To show:
					</Text>

					{actions.map((option, index) => (
						<RectangleCheckBox
							key={index}
							text={option.charAt(0).toUpperCase() + option.slice(1)}
							isActive={settings.actions[`is${option}`]}
							onClick={() => handleToggleActions(option)}
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

					<Text className='font-lexend_light text-white text-2xl mb-2'>
						Filter by:
					</Text>
					{settings.membersId.length === 0 ? (
						<TouchableOpacity
							onPress={handleOpenChooseMember}
							className='bg-dark_gray w-full p-2 rounded-lg mb-2'
						>
							<Text className='font-lexend_semibold text-white text-center text-xl '>
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
										onPress={() => {
											setSettings({ ...settings, membersId: [] })
										}}
									>
										<Text className='text-white text-lg'>Reset</Text>
									</TouchableOpacity>
									<TouchableOpacity
										className='bg-dark_gray p-2 rounded-lg flex items-center justify-center'
										onPress={handleOpenChooseMember}
									>
										<Feather name='plus' size={20} color='white' />
									</TouchableOpacity>
								</View>
							</View>
							{users?.map((user, index) => (
								<View key={index} className='relative z-0'>
									<CardMember
										data={user}
										folderId={id}
										isPressable={false}
										isIcons={false}
									/>
									<TouchableOpacity className='absolute  top-[17px]  right-5 p-2 border border-white rounded-xl'>
										<Ionicons
											name='trash-outline'
											size={20}
											color='white'
											className=' '
											onPress={() => deleteFilterMemberId(user.id)}
										/>
									</TouchableOpacity>
								</View>
							))}
						</View>
					)}

					{settings.itemsId.length === 0 ? (
						<TouchableOpacity
							onPress={handleOpenChooseItem}
							className='bg-dark_gray w-full p-2 rounded-lg mb-2 '
						>
							<Text className='font-lexend_semibold text-white text-center text-xl '>
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
									<TouchableOpacity className='bg-dark_gray p-1 px-3 rounded-lg'>
										<Text className='text-white text-lg'>Reset</Text>
									</TouchableOpacity>
									<TouchableOpacity
										className='bg-dark_gray p-2 rounded-lg flex items-center justify-center'
										onPress={handleOpenChooseItem}
									>
										<Feather name='plus' size={20} color='white' />
									</TouchableOpacity>
								</View>
							</View>
							{items?.map((item, index) => (
								<View key={index} className='relative z-0'>
									<CardItem
										item={item}
										currencyName={item.typeAmount}
										isPressable={false}
									/>

									<TouchableOpacity className='absolute  top-[17px]  right-5 p-2 border border-white rounded-xl'>
										<Ionicons
											name='trash-outline'
											size={20}
											color='white'
											className=' '
											onPress={() => deleteFilterItemId(item.id)}
										/>
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
