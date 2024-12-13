import { View, Text, FlatList } from 'react-native'
import React, { useCallback, useState } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import * as SystemUI from 'expo-system-ui'
import Loading from '@/src/components/Loading'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import { useAccount } from '@/src/providers/AccountProvider'
import { RefreshControl } from 'react-native-gesture-handler'
import CardMember from '@/src/components/home/member/CardMember'

const MembersScreen = () => {
    const { id: idString } = useLocalSearchParams()
    const folder_id = parseFloat(
      idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
    )

    
  
  const [search, setSearch] = useState('')
  const router = useRouter()
  const [refreshing, setRefreshing] = useState(false) 
  const [isLoading, setIsLoading] = useState(false)

  SystemUI.setBackgroundColorAsync("#1C1A1A")

  // const {folders:data} = useAccount()
  const data = useAccount().folders.filter(folder => folder.id === folder_id)[0].members
  console.log(useAccount().folders.map(folder => folder.id === folder_id ? folder.members : []));


  const openCreateFolder = () => {
    router.push('/(authenticated)/home/member/create?id=' + folder_id)
  }
  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    // await refetch() 

    setRefreshing(false)
  }, [])

  if (isLoading) return <Loading />
  return (
    <Container isPadding={false}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Members',
          headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#242121',
            
          },
          headerTintColor: '#fff',
        }}
      />
      <View className='flex-1'>
        <View className='flex-row w-full justify-center my-2 '>
          <SearchBar
            containerStyle='mr-2'
            search={search}
            handleSearch={handleSearch}
          />
          <AddButton handlePressAdd={openCreateFolder} />
        </View>
        {/* <CardsList/> */}
        {isLoading ? (
            <Loading />
        ) : (
          <FlatList
          className='mx-3 mb-24'
          data={search ? data.filter(member => member.fullName.toLowerCase().includes(search.toLowerCase()) || member.email.toLowerCase().includes(search.toLowerCase()) ) : data}
          keyExtractor={(member) => member.id.toString()}
          renderItem={({ item }) => <CardMember data={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />


        )}
      </View>
    </Container>
  )
}

export default MembersScreen