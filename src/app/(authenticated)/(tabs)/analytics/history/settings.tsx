import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomButton from '@/src/components/CustomButton'
import { useAccount } from '@/src/providers/AccountProvider'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'
import CardMember from '@/src/components/home/member/CardMember'
import { Feather, Ionicons } from '@expo/vector-icons'

const ViewSettingsScreen = () => {
	const { id: idString } = useLocalSearchParams()
	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
	const router = useRouter()
	const {
		transactionSettings,
		handleUpdateTransactionSettings,
		addFilterItemId,
		handleFilterAddMemberId,
		deleteFilterMemberId,
		deleteFilterItemId,
	} = useAccount()
	const [settings, setSettings] = useState(transactionSettings)
	const sortOptions = ['item name', 'member name', 'last updated']
	const actions: ['Created', 'Edited', 'Deleted'] = [
		'Created',
		'Edited',
		'Deleted',
	]
	React.useEffect(() => {
		setSettings(transactionSettings)
	}, [transactionSettings])

	const users = useAccount()
		.folders.find(folder => folder.id === id)
		?.members.filter(member => settings.membersId.includes(member.id))

	// const [viewOptions, setViewOptions] = React.useState(settings.)
	// const viewOptionsList: (keyof typeof settings.viewOptions)[] = ['name', 'image', 'quantity', 'price', 'totalPrice']
	const applySettings = () => {
		handleUpdateTransactionSettings(settings)
		router.back()
	}

	const handleOpenChooseMember = () => {
		router.push(`/analytics/history/choose_member?id=${id}`)
	}
	const handleOpenChooseItem = () => {
		router.push(`/analytics/history/settings/choose_item?id=${id}`)
	}

	const handleToggleSortBy = (sortBy: string) => {
		if (settings.sortBy === sortBy) {
			setSettings({ ...settings, isAsc: !settings.isAsc })
		} else {
			setSettings({ ...settings, sortBy, isAsc: true })
		}
	}

	const handleToggleActions = (action: 'Created' | 'Edited' | 'Deleted') => {
		const formattedAction: 'isCreated' | 'isEdited' | 'isDeleted' =
			action === 'Created'
				? 'isCreated'
				: action === 'Edited'
				? 'isEdited'
				: 'isDeleted'
		console.log(settings.actions[formattedAction])
		setSettings({
			...settings,
			actions: {
				...settings.actions,
				[formattedAction]: !settings.actions[formattedAction],
			},
		})
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
				}}
			/>
			<View className='mx-4 mt-2 flex-1 justify-between'>
				<View>
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
									<TouchableOpacity className='bg-dark_gray p-1 px-3 rounded-lg'>
										<Text className='text-white text-lg'>Reset</Text>
									</TouchableOpacity>
									<TouchableOpacity className='bg-dark_gray p-2 rounded-lg flex items-center justify-center'>
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
				</View>

				<CustomButton
					text='Apply'
					onClick={applySettings}
					styleContainer={`my-4 mx-0`}
					// disabled={!folderName}
				/>
			</View>
		</Container>
	)
}

export default ViewSettingsScreen
