import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import SelectDropDownCurency from '@/src/components/SelectDropDownCurency'
import { currencyType } from '@/src/types/types'
import CustomButton from '@/src/components/CustomButton'
import { useAccount } from '@/src/providers/AccountProvider'

export default function CreateFolder() {
	const router = useRouter()
	const params = useLocalSearchParams()
	const { type, options } = params

	const [folderName, setFolderName] = useState('')
	const [currency, setCurrency] = useState<currencyType>({
		name: 'USD',
		value: '$',
		countries: ['United States', 'Ecuador', 'El Salvador', 'Zimbabwe'],
	})

	const [folderType, setFolderType] = useState<string>('Simple')
	const [folderOptions, setFolderOptions] = useState<string[]>([])
	const [isErrorInput, setIsErrorInput] = useState(false)

	// const { mutate: createFolder } = useCreateFolder();
	const { handleCreateFolder } = useAccount()
	const createFolder = () => {
		if (!folderName) return setIsErrorInput(true)
		handleCreateFolder({
			name: folderName,
			currency: currency,
			type: folderType,
			options: folderOptions || [],
		})
		router.push('/(authenticated)/(tabs)/home/folder')
	}

	const handleChangeType = () => {
		router.push('/(authenticated)/(tabs)/home/folder/choose_type')
		router.setParams({ type: folderType, options: folderOptions })
	}

	useEffect(() => {
		if (type) {
			const folderTypeFromParams: string =
				typeof type === 'string' ? type : type[0]
			if (folderTypeFromParams !== folderType) {
				setFolderType(folderTypeFromParams)
			}
		}

		if (options) {
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
					title: 'Folder',
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
						<Text className='text-xl font-lexend_regular text-white'>
							Type:{' '}
						</Text>
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
					onClick={createFolder}
					styleContainer={`my-4 mx-0`}
					// disabled={!folderName}
					isActive={!!folderName}
				/>
			</View>
		</Container>
	)
}
