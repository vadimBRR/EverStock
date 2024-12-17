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
	const { transactionSettings, handleUpdateTransactionSettings, addFilterItemId, handleFilterAddMemberId, deleteFilterMemberId, deleteFilterItemId } = useAccount()
	const [settings, setSettings] = React.useState(transactionSettings)
  const sortOptions = ['item name', 'member name', 'last updated']
  const actions: ["Created", "Edited", "Deleted"]=["Created", "Edited", "Deleted"]
  // const [viewOptions, setViewOptions] = React.useState(settings.)
  // const viewOptionsList: (keyof typeof settings.viewOptions)[] = ['name', 'image', 'quantity', 'price', 'totalPrice']
	const applySettings = () => {
    handleUpdateTransactionSettings(settings)
		// handleUpdateViewSettings(settings)
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

  const handleToggleActions = (action: 'Created' | 'Edited' | 'Deleted') => {
    const formattedAction: 'isCreated' | 'isEdited' | 'isDeleted' = action === 'Created' ? 'isCreated' : action === 'Edited' ? 'isEdited' : 'isDeleted'
    console.log(settings.actions[formattedAction]);
    setSettings({
      ...settings,
      actions: {
        ...settings.actions,
        [formattedAction]: !settings.actions[formattedAction]
      }
    })
  }

  // const handleToggleViewOption = (option: keyof typeof viewOptions) => {
  //   setViewOptions({
  //     ...viewOptions,
  //     [option]: !viewOptions[option]

  //   })
  //   setSettings({
  //     ...settings,
  //     viewOptions: {
  //       ...settings.viewOptions,
  //       [option]: !settings.viewOptions[option]
  //     }
  //   })
  // }
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

          <Text className='font-lexend_light text-white text-2xl mb-2'>Sort By:</Text>
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
          <Text className='font-lexend_light text-white text-2xl mb-2'>To show:</Text>

          {actions.map((option, index) => (
            <RectangleCheckBox
              key={index}
              text={option.charAt(0).toUpperCase() + option.slice(1)}
              isActive={settings.actions[`is${option}`]}
              onClick={() => handleToggleActions(option)}
              isIcon={settings.sortBy === option}
              icon={settings.sortBy === option && settings.isAsc ? require('@/src/assets/icons/arrow_up.png') : require('@/src/assets/icons/arrow_down.png')}
              styleContainer='items-start m-0 p-2 px-4 mb-2'
              customBg='dark_gray'
              imageStyle='w-4 h-4 aspect-square'
            />
          ))}

          {/* <Text className='font-lexend_light text-white text-2xl my-2'>View Options:</Text>
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
          ))} */}
        </View>
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
