import { View, Text } from 'react-native'
import React from 'react'
import { useGetFolders, useGetFolderWithItems } from '@/src/api/folder'
import Loading from '../../Loading'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Card from './Card'

dayjs.extend(relativeTime)
export default function CardsList() {
  // const {data, isLoading} = useGetFolders();
  const {data, isLoading} = useGetFolderWithItems();
  console.log("here");
  console.log(JSON.stringify(data, null, 2));
  if(isLoading) return <Loading/>

  
  return (
    <View className='mx-3'>
      {data?.map((folder) => (
        <Card data={folder} key={folder.id}/>
        // <View key={folder.id}>
        //   <Text>{folder.name}</Text>
        //   {/* <Text>{folder?.}</Text> */}
        //   <Text>{folder?.totalMembers}</Text>
        //   <Text>{folder?.totalQuantity}</Text>
        //   <Text>{folder?.totalPrice}</Text>
        //   <Text>date: {dayjs(folder?.lastUpdated).fromNow()}</Text>

        // </View>
      ))}
    </View>
  )
}