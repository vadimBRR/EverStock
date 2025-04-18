import { View } from 'react-native'
import React, { useState, useMemo } from 'react'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import Container from '@/src/components/Container'
import SearchBar from '@/src/components/SearchBar'
import {
  FlatList,
  ScrollView,
  TouchableOpacity,
} from 'react-native-gesture-handler'
import CustomButton from '@/src/components/CustomButton'
import CardItem from '@/src/components/home/item/CardItem'
import { useGetFoldersWithItems } from '@/src/api/folder'
import { useAccount } from '@/src/providers/AccountProvider'

const ChooseItemScreen = () => {
  const { id: idString } = useLocalSearchParams()
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0])
  const router = useRouter()

  const { data: folders = [] } = useGetFoldersWithItems()
  const folder = folders.find(folder => folder.id === id)
  const items = folder?.items || []

  const { transactionSettings, handleUpdateTransactionSettings } = useAccount()
  const [choseItems, setChoseItems] = useState(transactionSettings.itemsId)
  const [search, setSearch] = useState('')

  const filteredItems = useMemo(() => {
    if (!search) return items
    const lower = search.toLowerCase()
    return items.filter(item => item.name.toLowerCase().includes(lower))
  }, [items, search])

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  const handleApply = () => {
    handleUpdateTransactionSettings({
      ...transactionSettings,
      itemsId: choseItems,
    })
    router.back()
  }

  const toggleItems = (itemId: number) => {
    setChoseItems(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    )
  }

  return (
    <Container isPadding={false}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Choose item',
          headerStyle: { backgroundColor: '#242121' },
          headerTintColor: '#fff',
        }}
      />
      <View className='flex-1 mx-4 mt-2 mb-5'>
        <ScrollView>
          <SearchBar
            search={search}
            handleSearch={handleSearch}
            containerStyle='w-full mb-4'
          />

          <FlatList
            scrollEnabled={false}
            data={filteredItems}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => toggleItems(item.id)}>
                <CardItem
                  item={item}
                  currencyName={item.typeAmount}
                  isPressable={false}
                  containerStyle={
                    choseItems.includes(item.id)
                      ? 'border-1 border-white bg-dark_gray'
                      : ''
                  }
                />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
        <CustomButton text='Apply' onClick={handleApply} />
      </View>
    </Container>
  )
}

export default ChooseItemScreen
