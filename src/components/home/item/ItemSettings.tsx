import React, { useCallback, useMemo } from 'react'
import { View, Text, Keyboard, TouchableOpacity } from 'react-native'
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'
import { useModal } from '@/src/providers/ModalProvider'
import { EvilIcons } from '@expo/vector-icons'
import OptionSettings from './OptionSettings'
import { useAccount } from '@/src/providers/AccountProvider'
import { useRouter } from 'expo-router'

type Props = {
	item_id: number
}
export default function ItemSettings({ item_id }: Props) {
  const router = useRouter()
	const {  handleCloseAnother, modalAnotherRef } = useModal()
  const {handleDeleteItem, handleCloneItem}= useAccount()

	const snapPoints = useMemo(() => ['40%', '60%'], [])

  const onDelete = () => {
    handleDeleteItem({id: item_id})
    handleCloseAnother()
    router.back()
  }

  const onClone = () => {
    handleCloneItem({item_id: item_id})
    handleCloseAnother()
    router.back()
  }
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

	return (
		<BottomSheetModal
			ref={modalAnotherRef}
			snapPoints={snapPoints}
			backdropComponent={renderBackdrop}
			enablePanDownToClose={true}
			backgroundStyle={{ backgroundColor: '#2A2A2A' }}
		>
			<TouchableWithoutFeedback
				onPress={() => Keyboard.dismiss()}
				className='flex-1 bg-black-600'
			>
				<View className=' mx-3 flex-col'>
					<View>
						<View className='flex-row justify-center items-center mb-2'>
							<Text className='text-2xl font-lexend_regular text-white'>
								Options
							</Text>

						</View>
						<View className=' flex-col px-2 '>
							
              <OptionSettings onPress={() => {onDelete()}} icon='delete' text='Delete' />
              {/* <OptionSettings onPress={() => {}} icon='image' text='Change images' /> */}
              <OptionSettings onPress={() => {}} icon='history' text='History' />
              <OptionSettings onPress={() => {}} icon='export' text='Export' />
              <OptionSettings onPress={() => {}} icon='move' text='Move' />
              <OptionSettings onPress={() => {onClone()}} icon='clone' text='Clone' />
							
						</View>
					</View>
				</View>
			</TouchableWithoutFeedback>
		</BottomSheetModal>
	)
}
