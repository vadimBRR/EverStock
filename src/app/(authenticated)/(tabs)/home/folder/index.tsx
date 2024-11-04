import { View, Text } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack, useRouter } from 'expo-router'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import ModalCreate from '@/src/components/ModalCreate'
import { useModal } from '@/src/providers/ModalProvider'
import CardsList from '@/src/components/home/folder/CardsFolderList'

export default function HomeScreen() {
  const [search, setSearch] = React.useState('')
  // const {handleOpen} = useModal()
  const router = useRouter();
  const openCreateFolder = () =>{
    router.push('/(authenticated)/home/folder/create')
  }
  const handleSearch = (value: string) => {
    setSearch(value)
  }
  return (
    <Container isPadding={false}>
      <Stack.Screen options={{headerShown:true, title: 'Home', headerTitleAlign: 'center'}}/>
      <View>
        <View className='flex-row w-full justify-center my-2 '>
          <SearchBar containerStyle='mr-2' search={search} handleSearch={handleSearch}/>
          <AddButton handlePressAdd={openCreateFolder}/>
        </View>
        <CardsList/>



      </View>
      {/* <ModalCreate/> */}
    </Container>
  )
}