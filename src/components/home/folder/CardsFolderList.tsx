import { View, Text } from 'react-native'
import React from 'react'
import { useGetFoldersWithItems } from '@/src/api/folder'
import Loading from '../../Loading'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import CardFolder from './CardFolder'

dayjs.extend(relativeTime)
export default function CardsList() {
	// const {data, isLoading} = useGetFolders();
	const { data, isLoading } = useGetFoldersWithItems()
	if (isLoading) return <Loading />

	return (
		<View className='mx-3'>
			{data?.map(folder => (
				<CardFolder data={folder} key={folder.id} />
			))}
		</View>
	)
}
