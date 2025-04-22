import { View, Text, Keyboard } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'
import { useModal } from '@/src/providers/ModalProvider'
import CustomButton from './CustomButton'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { useGetFoldersWithItems } from '@/src/api/folder'

type Props = {
	folderId: number
}

export default function ModalExport({ folderId }: Props) {
	const { handleCloseExport, modalExportRef } = useModal()
	const snapPoints = useMemo(() => ['30%', '40%'], [])
	const { data: folders } = useGetFoldersWithItems()

	const folder = folders?.find(f => f.id === folderId)

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				{...props}
			/>
		),
		[]
	)

	const exportAsJSON = async () => {
		if (!folder) return
		const data = JSON.stringify(folder.items, null, 2)
		const fileUri = FileSystem.documentDirectory + `items_export.json`
		await FileSystem.writeAsStringAsync(fileUri, data)
		await Sharing.shareAsync(fileUri)
		handleCloseExport()
	}

	const exportAsCSV = async () => {
		if (!folder) return
		const items = folder.items
		const headers = Object.keys(items[0] || {}).join(',') + '\n'
		const rows = items
			.map(item =>
				Object.values(item)
					.map(v => `"${v}"`)
					.join(',')
			)
			.join('\n')
		const csv = headers + rows
		const fileUri = FileSystem.documentDirectory + `items_export.csv`
		await FileSystem.writeAsStringAsync(fileUri, csv)
		await Sharing.shareAsync(fileUri)
		handleCloseExport()
	}

	return (
		<BottomSheetModal
			ref={modalExportRef}
			snapPoints={snapPoints}
			backdropComponent={renderBackdrop}
			enablePanDownToClose
			backgroundStyle={{ backgroundColor: '#2A2A2A' }}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<View className='mx-4 my-2'>
					<Text className='text-2xl text-white font-lexend_medium text-center mb-4'>
						Export Items
					</Text>
					<CustomButton text='Export as JSON' onClick={exportAsJSON} />
					<CustomButton
						text='Export as CSV'
						onClick={exportAsCSV}
						styleContainer='mt-3'
					/>
				</View>
			</TouchableWithoutFeedback>
		</BottomSheetModal>
	)
}
