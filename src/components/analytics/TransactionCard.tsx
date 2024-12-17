import { View, Text } from 'react-native'
import React from 'react'

const TransactionCard = ({fullName, action, date}: {fullName: string, action: string, date: string}) => {
  return (
    <View className='w-full bg-black-700 px-2 py-1'>
      <Text>{fullName}</Text>
      <View>
        <Text>{action}</Text>
      </View>
      
    </View>
  )
}

export default TransactionCard