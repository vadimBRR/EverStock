import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import TransactionCard from './TransactionCard'
import { useAccount } from '@/src/providers/AccountProvider'
import { FlatList } from 'react-native-gesture-handler'
import { useRouter } from 'expo-router'
import { transactionType } from '@/src/types/types'

const HistoryContainer = ({
  transaction,
  activeIndex,
  folderMap,
}: {
  transaction: any
  activeIndex: number
  folderMap: any
}) => {
  const router = useRouter()
  const { getUserFullName, getAction } = useAccount()

  const handleOpenDetailedView = () => {
    router.push(`/(authenticated)/(tabs)/analytics/history?activeIndex=${activeIndex}`)
  }

  return (
    <View className='bg-black-600 rounded-[17px] py-3 mb-2 border border-black/10 mx-2 mt-4'>
      <View className='flex flex-row items-center justify-between px-2 mb-2'>
        <View className='w-fit'>
          <Text className='font-lexend_semibold text-lg text-white w-min px-2'>
            History:
          </Text>
        </View>
        <View className='flex-row items-center gap-2'>
          <TouchableOpacity className='bg-main_light rounded-[17px] py-2 px-3'>
            <Text className='font-lexend_semibold text-[14px] text-white'>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity className='bg-main_light rounded-[17px] py-2 px-3' onPress={handleOpenDetailedView}>
            <Text className='font-lexend_semibold text-[14px] text-white'>Detailed View</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={transaction?.sort((a: any, b:any) => b.date.localeCompare(a.date))}
        scrollEnabled={false}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => {
              router.push(`/(authenticated)/(tabs)/analytics/history/details?id=${item.id}&folder_id=${activeIndex}`)
            }}
          >
            <TransactionCard
              key={index}
              fullName={getUserFullName({ user_id: item.user_id, activeIndex })}
              action={getAction(item)}
              date={item.date}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  )
}

export default HistoryContainer
