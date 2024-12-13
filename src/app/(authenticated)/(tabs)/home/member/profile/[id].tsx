import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const MemberProfile = () => {
  const {id:idString} = useLocalSearchParams();
  const member_id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)

  return (
    <View>
      <Text>MemberProfile</Text>
    </View>
  )
}

export default MemberProfile