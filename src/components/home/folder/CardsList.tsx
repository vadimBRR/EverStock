import { View, Text } from 'react-native'
import React from 'react'
import { useGetFolders } from '@/src/api/folder'
import Loading from '../../Loading'

export default function CardsList() {
  const {data, isLoading} = useGetFolders();
  console.log(data);
  if(isLoading) return <Loading/>
  return (
    <View>
      {data?.map((folder) => (
        <View key={folder.id}>
          <Text>{folder.name}</Text>
        </View>
      ))}
    </View>
  )
}