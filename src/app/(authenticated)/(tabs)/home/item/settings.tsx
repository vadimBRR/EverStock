import { View, Text } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack, useRouter } from 'expo-router'
import CustomButton from '@/src/components/CustomButton'
import { useAccount } from '@/src/providers/AccountProvider'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'

const ViewSettingsTransactionScreen = () => {

	const router = useRouter()
	const { viewSettings, handleUpdateViewSettings } = useAccount()
	const [settings, setSettings] = React.useState(viewSettings)
	const sortOptions = [
		'name',
		'quantity',
		'price',
		'total price',
		'last updated',
	]
	const [viewOptions, setViewOptions] = React.useState(settings.viewOptions)
	const viewOptionsList: (keyof typeof settings.viewOptions)[] = [
		'name',
		'image',
		'quantity',
		'price',
		'totalPrice',
	]
	const applySettings = () => {
		handleUpdateViewSettings(settings)
		router.back()
	}

	const handleToggleSortBy = (sortBy: string) => {
		if (settings.sortBy === sortBy) {
			setSettings({ ...settings, isAsc: !settings.isAsc })
		} else {
			setSettings({ ...settings, sortBy, isAsc: true })
		}
	}

	const handleToggleViewOption = (option: keyof typeof viewOptions) => {
		setViewOptions({
			...viewOptions,
			[option]: !viewOptions[option],
		})
		setSettings({
			...settings,
			viewOptions: {
				...settings.viewOptions,
				[option]: !settings.viewOptions[option],
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

					<Text className='font-lexend_light text-white text-2xl my-2'>
						View Options:
					</Text>
					{viewOptionsList.map((option, index) => (
						<RectangleCheckBox
							key={index}
							text={option.charAt(0).toUpperCase() + option.slice(1)}
							isActive={viewOptions[option]}
							onClick={() => handleToggleViewOption(option)}
							isIcon={false}
							styleContainer='items-start m-0 p-1 px-4 mb-2'
							customBg='dark_gray'
							imageStyle='w-4 h-4 aspect-square'
						/>
					))}
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

export default ViewSettingsTransactionScreen
