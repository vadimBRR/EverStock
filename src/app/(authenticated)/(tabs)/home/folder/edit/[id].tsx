import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import SelectDropDownCurency from '@/src/components/SelectDropDownCurency'
import { currencyType } from '@/src/types/types'
import CustomButton from '@/src/components/CustomButton'
import { useAccount } from '@/src/providers/AccountProvider'

export default function EditFolder() {
  console.log("edit");
	const router = useRouter()
	const params = useLocalSearchParams()
	const { type, options,id:idString } = params

  const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

  const current_folder = useAccount().folders.find(folder => folder.id === id)


  

	const [folderName, setFolderName] = useState(current_folder?.name || '')
	const [currency, setCurrency] = useState<currencyType>(current_folder?.currency || {name: 'USD', value: '$', countries: ['United States', 'Ecuador', 'El Salvador', 'Zimbabwe']})

	const [folderType, setFolderType] = useState<string>(current_folder?.type || 'Simple')
	const [folderOptions, setFolderOptions] = useState<string[]>(current_folder?.options || [])
	const [isErrorInput, setIsErrorInput] = useState(false)

  if (!id) {
    ;<View className='flex-1 justify-center items-center'>
      <Text className='font-bold'>Failed to fetch</Text>
    </View>
  }

	// const { mutate: createFolder } = useCreateFolder();
  const {handleUpdateFolder} = useAccount();
	const updateFolder = () => {
    handleUpdateFolder({id: id, name: folderName, currency: currency, type: folderType, options: folderOptions || []});

    router.push('/(authenticated)/(tabs)/home/folder');

  }


	const handleChangeType = () => {
		router.push('/(authenticated)/(tabs)/home/folder/choose_type')
		router.setParams({ type: folderType, options: folderOptions })
	}

	useEffect(() => {
		if (type) {
			console.log('type', type)
			const folderTypeFromParams: string =
				typeof type === 'string' ? type : type[0]
			if (folderTypeFromParams !== folderType) {
				setFolderType(folderTypeFromParams)
			}
		}

		if (options) {
			console.log('options', options)
			const optionsFromParams: string[] | null = Array.isArray(options)
				? options
				: options
				? [options]
				: []

			if (JSON.stringify(optionsFromParams) !== JSON.stringify(folderOptions)) {
				setFolderOptions(optionsFromParams)
			}
		}
	}, [type, JSON.stringify(options)])

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Edit Folder',
					headerStyle: {
						backgroundColor: '#242121',
					},
					headerTintColor: '#fff',
				}}
			/>
			<View className='mx-4 mt-2 flex-1 justify-between'>
				<View>
					<CustomInput
						label={'Name of the folder'}
						name={folderName}
						setName={setFolderName}
						isError={isErrorInput}
					/>
					<TouchableOpacity
						className='w-full rounded-2xl border-dark_gray border py-[12px] flex-row justify-between bg-black-600 px-4 mt-2 items-center'
						onPress={handleChangeType}
					>
						<Text className='text-xl font-lexend_regular text-white'>Type: </Text>
						<Text className='text-xl font-lexend_light text-white rounded-lg border border-dark_gray p-1 px-2 w-[120px] text-center'>
							{folderType}
						</Text>
					</TouchableOpacity>
					<View className=''>
						<SelectDropDownCurency
							selectedValue={currency}
							setSelectedValue={setCurrency}
							text='Currency:  '
						/>
					</View>
				</View>
				<CustomButton
					text='Create Folder'
					onClick={updateFolder}
					styleContainer={`my-4 mx-0`}
					// disabled={!folderName}
					isActive={!!folderName}
				/>
			</View>
		</Container>
	)
}
