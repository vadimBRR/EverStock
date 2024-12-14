import { View, Text } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomButton from '@/src/components/CustomButton'
import { useAccount } from '@/src/providers/AccountProvider'
import RectangleCheckBox from '@/src/components/RectangleCheckBox'

const ViewSettingsScreen = () => {
	// const { id: idString } = useLocalSearchParams()
	// const id = parseFloat(
	// 	idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	// )
	const router = useRouter()
	const { viewSettings, handleUpdateViewSettings } = useAccount()
	const [settings, setSettings] = React.useState(viewSettings)
  const sortOptions = ['name', 'quantity', 'price', 'total price', 'last updated']
	const applySettings = () => {
		handleUpdateViewSettings(settings)
		router.back()
		// router.setParams({ id })
	}

  const handleToggleSortBy = (sortBy: string) => {
    if (settings.sortBy === sortBy) {
      setSettings({ ...settings, isAsc: !settings.isAsc })
    } else {
      setSettings({ ...settings, sortBy, isAsc: true })
    }

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
			<View className='mx-4 mt-2 flex-1 '>

        {sortOptions.map((option, index) => (
          <RectangleCheckBox
            key={index}
            text={option.charAt(0).toUpperCase() + option.slice(1)}
            isActive={settings.sortBy === option}
            onClick={() => handleToggleSortBy(option)}
            isIcon={settings.sortBy === option}
            icon={settings.sortBy === option && settings.isAsc ? require('@/src/assets/icons/arrow_up.png') : require('@/src/assets/icons/arrow_down.png')}
            styleContainer='items-start m-0 p-2 px-4 mb-2'
            customBg='dark_gray'
            imageStyle='w-4 h-4 aspect-square'
          />
        ))}
				{/* <RectangleCheckBox
					text='Name'
          isActive={viewSettings.sortBy === 'name'}
          onClick={() => setSettings({ ...settings, sortBy: 'name', isAsc: !settings.isAsc })}
					isIcon={true}
					icon={settings.sortBy === 'name' && settings.isAsc ? require('@/src/assets/icons/arrow_up.png') : require('@/src/assets/icons/arrow_down.png')}
					styleContainer='items-start m-0 p-2 px-4 mb-2'
					customBg='dark_gray'
          imageStyle='w-4 h-4 aspect-square'
				/> */}


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
