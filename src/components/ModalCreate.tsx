import { View, Text, Keyboard } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import { useModal } from '@/src/providers/ModalProvider'
import {
	BottomSheetBackdrop,
	BottomSheetModal,
	TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'
import CustomButton from './CustomButton'
import { Href, useRouter } from 'expo-router'
import { useRolesStore } from '../store/useUserRoles'
import Toast from 'react-native-toast-message'

type Props = {
	folderId: number
}
export default function ModalCreate({ folderId }: Props) {
	const router = useRouter()

	const { handleCloseCreate, modalCreateRef } = useModal()
	const roles = useRolesStore(state => state.roles)

	const snapPoints = useMemo(() => ['30%', '50%'], [])
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

	const onAddMember = () => {
		handleCloseCreate()
		router.push('/(authenticated)/home/member/' + folderId)
	}
	const onCreateItem = () => {
		if (roles?.isAddItem) {
      handleCloseCreate()
      router.push(('/(authenticated)/home/item/create?id=' + folderId) as Href)
    } else {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'You do not have rights to add items.',
        position: 'top',
      })
    }
	}
	return (
		<BottomSheetModal
			ref={modalCreateRef}
			snapPoints={snapPoints}
			backdropComponent={renderBackdrop}
			enablePanDownToClose={true}
			backgroundStyle={{ backgroundColor: '#2A2A2A' }}

			style={{ flex: 1 }}
		>
			<TouchableWithoutFeedback
				onPress={() => Keyboard.dismiss()}
				className='flex-1 bg-black-600'
			>
				<View className=' mx-3 flex-col'>
					<View>
						<View className='flex-row justify-center items-center mb-2'>
							<Text className='text-2xl font-lexend_regular text-white'>
								Create
							</Text>


						</View>
						<View className=' flex-col'>
							<Text className='font-lexend_light text-lg text-center mb-3 text-white'>
								Choose what you want to create:
							</Text>
							<CustomButton
								text='Item'
								icon={require('@/src/assets/icons/profile/item_dark.png')}
								isIcon
								styleContainer='items-start mb-3'
								onClick={onCreateItem}
							/>
							<CustomButton
								text='Member'
								icon={require('@/src/assets/icons/profile/account_dark.png')}
								isIcon
								styleContainer='items-start'
								imageStyle='w-7 h-7'
								onClick={onAddMember}
							/>
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</BottomSheetModal>
	)
}
