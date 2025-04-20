import { View, Text, Keyboard } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  TouchableWithoutFeedback,
} from '@gorhom/bottom-sheet'
import CustomButton from './CustomButton'
import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import { useModal } from '@/src/providers/ModalProvider'

type Props = {
  transactions: any[]
}

export default function ModalExportItem({ transactions }: Props) {
  const { handleCloseExport, modalExportRef } = useModal()
  const snapPoints = useMemo(() => ['30%', '40%'], [])

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

  const itemId = transactions[0]?.item_id || 'unknown'

  const itemSnapshots = useMemo(() => {
    return transactions
      .map(t => t.changed_item || t.prev_item)
      .filter(Boolean)
  }, [transactions])

  const exportAsJSON = async () => {
    const data = JSON.stringify(itemSnapshots, null, 2)
    const fileUri = FileSystem.documentDirectory + `item_${itemId}_history.json`
    await FileSystem.writeAsStringAsync(fileUri, data)
    await Sharing.shareAsync(fileUri)
    handleCloseExport()
  }

  const exportAsCSV = async () => {
    if (itemSnapshots.length === 0) return
    const headers = Object.keys(itemSnapshots[0]).join(',') + '\n'
    const rows = itemSnapshots
      .map(t => Object.values(t).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const csv = headers + rows
    const fileUri = FileSystem.documentDirectory + `item_${itemId}_history.csv`
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
            Export Item History
          </Text>
          <CustomButton text='Export as JSON' onClick={exportAsJSON} />
          <CustomButton text='Export as CSV' onClick={exportAsCSV} styleContainer='mt-3' />
        </View>
      </TouchableWithoutFeedback>
    </BottomSheetModal>
  )
}
