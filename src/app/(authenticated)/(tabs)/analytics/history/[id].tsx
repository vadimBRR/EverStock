import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'

const HistoryDetailed = () => {
    const { id: idString, folder_id: folderIdString } = useLocalSearchParams()
    const id = parseFloat(
      idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
    )
    const folder_id = parseFloat(
      folderIdString ? (typeof folderIdString === 'string' ? folderIdString : idString[0]) : ''
    )
    const router = useRouter()
  return (
    <View>
      <Text>HistoryDetailed</Text>
    </View>
  )
}

export default HistoryDetailed