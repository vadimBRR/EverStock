import { View, Text } from 'react-native'
import React from 'react'
import Loading from '../../Loading'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import CardFolder from './CardFolder'

dayjs.extend(relativeTime)
export default function CardsList() {
  const data = [{id: 1, name: 'test', totalQuantity: 12, totalPrice: 12.12, currency: 'USD'}]
  const [isLoading, setIsLoading] = React.useState(false);
	if (isLoading) return <Loading />

	return (
		<View className='mx-3'>
			{data?.map(folder => (
				<CardFolder data={folder} key={folder.id} />
			))}
		</View>
	)
}
