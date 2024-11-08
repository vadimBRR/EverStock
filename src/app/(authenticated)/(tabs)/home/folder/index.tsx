import { View, FlatList, RefreshControl } from 'react-native'
import React, { useCallback, useState } from 'react'
import Container from '@/src/components/Container'
import { Stack, useRouter } from 'expo-router'
import SearchBar from '@/src/components/SearchBar'
import AddButton from '@/src/components/AddButton'
import { useGetFoldersWithItems } from '@/src/api/folder'
import CardFolder from '@/src/components/home/folder/CardFolder'
import Loading from '@/src/components/Loading'

export default function HomeScreen() {
	const [search, setSearch] = useState('')
	const router = useRouter()
  const [refreshing, setRefreshing] = useState(false)


	const { data, isLoading,refetch } = useGetFoldersWithItems()
	const openCreateFolder = () => {
		router.push('/(authenticated)/home/folder/create')
	}
	const handleSearch = (value: string) => {
		setSearch(value)
	}

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    await refetch() 
    setRefreshing(false)
  }, [refetch])

  if (isLoading) return <Loading />
	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Home',
					headerTitleAlign: 'center',
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
          className='mx-3'
          data={data}
          keyExtractor={(folder) => folder.id.toString()}
          renderItem={({ item }) => <CardFolder data={item} />}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />


				)}
			</View>
		</Container>
	)
}
