import { View, Text } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'
import HeaderAnalytics from '@/src/components/analytics/HeaderAnalytics'
import AnalyticsChart from '@/src/components/analytics/AnalyticsChart'
import HistoryContainer from '@/src/components/analytics/HistoryContainer'
import { ScrollView } from 'react-native-gesture-handler'
import { useGetFoldersWithItems } from '@/src/api/folder' 
import { useGetTransaction } from '@/src/api/transaction' // додай свій хук тут
import { useSyncUserRoles } from '@/src/hooks/useSyncUserRoles'

const AnalyticsScreen = () => {
  const { data: folders = [] } = useGetFoldersWithItems()
  const [activeIndex, setActiveIndex] = React.useState<number>(-1)

  const folders_id = React.useMemo(() => {
    if(folders === null) return []
    return folders.map(folder => folder.id)
  }, [folders])

  const folderMap = React.useMemo(() => {
    if(folders === null) return []
    return folders.reduce((acc, folder) => {
      acc[folder.id] = folder
      return acc
    }, {} as Record<number, typeof folders[0]>)
  }, [folders])

  React.useEffect(() => {
    if (folders_id.length > 0 && activeIndex === -1) {
      setActiveIndex(folders_id[0])
    }
  }, [folders_id])

  const activeFolder = folderMap[activeIndex]
  useSyncUserRoles(activeFolder as any)

  const { data: transaction } = useGetTransaction(activeIndex)

  return (
    <Container isPadding={false} container_style='mx-'>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Analytics',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#242121',
          },
          headerTintColor: '#fff',
        }}
      />
      {transaction ? (
        <>
          {transaction.info.length === 0 ? (
            <View className='flex-1  mt-2 '>
              <HeaderAnalytics
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                folders_id={folders_id}
                folderMap={folderMap}
              />
              <View className='flex-1 items-center justify-center px-2'>
                <Text className='font-lexend_semibold text-[24px] text-white text-center'>
                  No transactions found
                </Text>
                <Text className='font-lexend_light text-[16px] text-white text-center'>
                  In the "Home" tab, you can create a folder and add items
                </Text>

              </View>
            </View>
          ) : folders_id.length !== 0 ? (
            <ScrollView className='flex-1 mt-2'>
              <HeaderAnalytics
                activeIndex={activeIndex}
                setActiveIndex={setActiveIndex}
                folders_id={folders_id}
                folderMap={folderMap}
              />
              
              <AnalyticsChart transaction={transaction.info} />

              <View className='w-full mt-2'>
                <HistoryContainer
                  transaction={transaction.info}
                  activeIndex={activeIndex}
                  folderMap={folderMap}
                />
              </View>
            </ScrollView>
          ) : (
            <View className='flex-1 justify-center items-center'>
              <Text className='font-lexend_semibold text-[24px]'>
                No folders found
              </Text>
              <Text className='font-lexend_light text-[16px]'>
                In the "Home" tab, you can create a folder
              </Text>
            </View>
          )}
        </>
      ) : (
        <View className='flex-1 justify-center items-center px-2'>
          <Text className='font-lexend_semibold text-[24px] text-white text-center'>
            No folders found :(
          </Text>
          <Text className='font-lexend_light text-[16px] text-white text-center'>
            In the "Home" tab, you can create a folder
          </Text>
        </View>
      )}
    </Container>
  )
}

export default AnalyticsScreen
