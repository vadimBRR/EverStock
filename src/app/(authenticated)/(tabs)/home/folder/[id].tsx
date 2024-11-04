import { View, Text } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'
import { useGetFoldersWithItems } from '@/src/api/folder'
import Loading from '@/src/components/Loading'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import { useModal } from '@/src/providers/ModalProvider'
import TotalInfo from '@/src/components/home/item/TotalInfo'
import CardItemsList from '@/src/components/home/item/CardItemsList'
import { Tables } from '@/src/types/types'
import ModalCreate from '@/src/components/ModalCreate'

export default function FolderScreen() {
	const { id:idString } = useLocalSearchParams()
  const id = parseFloat(
		idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
	)
  const [search, setSearch] = React.useState('')
  const handleSearch = (value: string) => {
    setSearch(value)
  }
  const {handleOpen} = useModal()

  if (!id) {
		<View className='flex-1 justify-center items-center'>
			<Text className='font-bold'>Failed to fetch</Text>
		</View>
	}
  const { data, isLoading } = useGetFoldersWithItems()
	if (isLoading) return <Loading />
  const folder = data?.find(folder => folder.id === id)
  const items:Tables<'items'>[] | [] = folder?.items || [];

  if (!folder) return <Text>Folder not found</Text>

  console.log(folder);
  
	return (
    <Container isPadding={false}>
      <Stack.Screen options={{headerShown:true,title: folder.name, headerTitleAlign: 'center'}} />
      <View className='flex-row w-full justify-center my-2 '>
          <SearchBar containerStyle='mr-2' search={search} handleSearch={handleSearch}/>
          <AddButton handlePressAdd={handleOpen}/>
      </View>
      <TotalInfo totalMembers={folder.totalMembers} totalPrice={folder.totalPrice} totalQuantity={folder.totalQuantity} currencyFolder={folder.currency} />

      <CardItemsList data={items} currency={folder.currency || 'USD'}/>
      <ModalCreate folderId={folder.id}/>
    </Container>
	)
}
