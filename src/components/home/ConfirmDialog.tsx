import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Modal from 'react-native-modal'

const ConfirmDialog = ({
	isVisible,
	onConfirm,
	onCancel,
	title = 'Are you sure?',
	description = 'This action cannot be undone.',
	confirmText = 'Delete',
}: {
	isVisible: boolean
	onConfirm: () => void
	onCancel: () => void
	title?: string
	description?: string
	confirmText?: string
}) => {
	return (
		<Modal isVisible={isVisible}>
			<View className='bg-black-700 p-6 rounded-2xl border border-white/10'>
				<Text className='text-white text-lg font-lexend_semibold mb-2'>
					{title}
				</Text>
				<Text className='text-gray text-sm font-lexend_light mb-6'>
					{description}
				</Text>
				<View className='flex-row justify-end'>
					<TouchableOpacity onPress={onCancel} className='mr-4'>
						<Text className='text-gray font-lexend_medium'>Cancel</Text>
					</TouchableOpacity>
					<TouchableOpacity onPress={onConfirm}>
						<Text className='text-red-400 font-lexend_medium'>
							{confirmText}
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}

export default ConfirmDialog
