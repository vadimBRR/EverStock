import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Href, useRouter } from 'expo-router'
import { WarehouseUserType } from '@/src/types/types'

type Props = {
	data: WarehouseUserType
	folderId: number
	containerStyle?: string
	isPressable?: boolean
	isIcons?: boolean
}

export default function CardMember({
	data,
	folderId,
	containerStyle,
	isPressable = true,
	isIcons = true,
}: Props) {
	const router = useRouter()

	return (
		<View
			className={`w-full bg-black-700 rounded-[17px] py-3 px-4 mb-2 border border-black/10 ${containerStyle}`}
		>
			<View></View>
			<View className='flex-col'>
				<TouchableOpacity
					className='flex-col '
					onPress={() => {
						isPressable &&
							router.push(
								('/(authenticated)/(tabs)/home/member/profile/' +
									data.id +
									'?folderId=' +
									folderId) as Href
							)
					}}
				>
					<Text className='font-lexend_regular text-xl text-white'>
						{data.fullName}
					</Text>
					<View className='flex-row justify-between items-center'>
						<View className='flex-row  items-center  mr-2'>
							<Text className='font-lexend_regular text-gray  ml-0'>
								{data.email}
							</Text>
						</View>
						{isIcons && (
							<View className='flex-row items-center'>
								{data.roles.isAdmin && (
									<Image
										source={require('@/src/assets/icons/member/isAdmin.png')}
										className='w-5 h-5 aspect-square'
									/>
								)}
								{data.roles.isView && !data.roles.isAdmin && (
									<Image
										source={require('@/src/assets/icons/member/isView.png')}
										className='w-5 h-5 aspect-square'
									/>
								)}
								{data.roles.isAddItem && !data.roles.isAdmin && (
									<Image
										source={require('@/src/assets/icons/member/isAddItem.png')}
										className='w-5 h-5 aspect-square'
									/>
								)}
								{data.roles.isDeleteItem && !data.roles.isAdmin && (
									<Image
										source={require('@/src/assets/icons/member/isDeleteItem.png')}
										className='w-5 h-5 aspect-square'
									/>
								)}
								{data.roles.isEdit && !data.roles.isAdmin && (
									<Image
										source={require('@/src/assets/icons/member/isEdit.png')}
										className='w-5 h-5 aspect-square'
									/>
								)}
								{data.roles.isCanInvite && !data.roles.isAdmin && (
									<Image
										source={require('@/src/assets/icons/member/isCanInvite.png')}
										className='w-5 h-5 aspect-square'
									/>
								)}
								{data.roles.isManager && !data.roles.isAdmin && (
									<Image
										source={require('@/src/assets/icons/member/isManager.png')}
										className='w-5 h-5 aspect-square'
									/>
								)}
							</View>
						)}
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}
