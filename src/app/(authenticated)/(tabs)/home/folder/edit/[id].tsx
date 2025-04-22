import { View, Text, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomInput from '@/src/components/CustomInput'
import SelectDropDownCurency from '@/src/components/SelectDropDownCurency'
import { currencyType } from '@/src/types/types'
import CustomButton from '@/src/components/CustomButton'
import { useSupabase } from '@/src/providers/SupabaseProvider'
import { showSuccess, showError } from '@/src/utils/toast'
import { Ionicons } from '@expo/vector-icons'
import ConfirmDialog from '@/src/components/home/ConfirmDialog'
import { useDeleteFolder } from '@/src/api/folder'

export default function EditFolder() {
	const router = useRouter()
	const params = useLocalSearchParams()
	const { id: idString, type, options } = params
	const { getFoldersWithStatistic, updateFolder } = useSupabase()
	const { mutate: deleteFolderMutation } = useDeleteFolder()

	const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false)

	const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

	const [folderName, setFolderName] = useState('')
	const [currency, setCurrency] = useState<currencyType>({
		name: 'USD',
		value: '$',
		countries: ['United States', 'Ecuador', 'El Salvador', 'Zimbabwe'],
	})
	const [folderType, setFolderType] = useState<string>('Simple')
	const [folderOptions, setFolderOptions] = useState<string[]>([])
	const [isErrorInput, setIsErrorInput] = useState(false)
	const handleDeleteFolder = () => {
		setIsDeleteDialogVisible(true)
	}

	useEffect(() => {
		const fetchFolder = async () => {
			const folders = await getFoldersWithStatistic?.()
			const current = folders?.find(folder => folder.id === id)
			if (current) {
				setFolderName(current.name)
				setCurrency({
					name: current.currency || 'USD',
					value: '$',
					countries: [],
				})
				setFolderType(current.type || 'Simple')
				setFolderOptions(current.options || [])
			}
		}
		if (id) fetchFolder()
	}, [id])

	const handleUpdateFolder = async () => {
		if (!folderName) {
			setIsErrorInput(true)
			showError('Folder name is required')
			return
		}

		try {
			await updateFolder?.(
				id,
				folderName,
				folderType,
				currency.name,
				folderOptions || []
			)
			showSuccess('Folder updated successfully')
			router.back()
		} catch (error) {
			showError('Update failed', (error as Error).message)
		}
	}

	const handleChangeType = () => {
		router.push('/(authenticated)/(tabs)/home/folder/choose_type')
		router.setParams({ type: folderType, options: folderOptions })
	}

	useEffect(() => {
		if (type) {
			const folderTypeFromParams = typeof type === 'string' ? type : type[0]
			if (folderTypeFromParams !== folderType)
				setFolderType(folderTypeFromParams)
		}
		if (options) {
			const optionsFromParams = Array.isArray(options)
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
					headerStyle: { backgroundColor: '#242121' },
					headerTintColor: '#fff',
					headerRight: () => (
						<TouchableOpacity
							onPress={handleDeleteFolder}
							className='mr-4 p-1 rounded-md'
						>
							<Ionicons name='trash-outline' size={22} color='white' />
						</TouchableOpacity>
					),
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
					<SelectDropDownCurency
						selectedValue={currency}
						setSelectedValue={setCurrency}
						text='Currency:  '
					/>
				</View>

				<View>
					<CustomButton
						text='Apply'
						onClick={handleUpdateFolder}
						styleContainer={`mb-4 mx-0`}
						isActive={!!folderName}
					/>
				</View>
			</View>
			<ConfirmDialog
				isVisible={isDeleteDialogVisible}
				onCancel={() => setIsDeleteDialogVisible(false)}
				onConfirm={() => {
					setIsDeleteDialogVisible(false)
					deleteFolderMutation(id, {
						onSuccess: () => {
							showSuccess('Folder deleted successfully')
							router.replace('/(authenticated)/(tabs)/home/folder')
							router.setParams({})
						},
						onError: (err: any) => {
							showError('Delete failed', err.message)
						},
					})
				}}
				title='Delete Folder'
				description='Are you sure you want to delete this folder? This action cannot be undone.'
			/>
		</Container>
	)
}
