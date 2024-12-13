import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack, useRouter } from 'expo-router'

export default function ProfileScreen() {
  const router = useRouter()
  const buttons = [
    {img: require('@/src/assets/icons/profile/account_dark.png'), title: 'Account', href: '/(authenticated)/(tabs)/profile/account'},
    {img: require('@/src/assets/icons/profile/theme_dark.png'), title: 'Theme', href: '/(authenticated)/(tabs)/profile/theme'},
    {img: require('@/src/assets/icons/profile/export_dark.png'), title: 'Export', href: '/(authenticated)/(tabs)/profile/export'},
    {img: require('@/src/assets/icons/profile/support_dark.png'), title: 'Help & Support', href: '/(authenticated)/(tabs)/profile/support'},
    
    {img: require('@/src/assets/icons/profile/logout_dark.png'), title: 'Logout', href: 'logout'},
  ]

  const handlePress = async (href: string) => {
    if(href === 'logout') {
      router.push('/(authorization)/sign-in')
    } else {
      router.push(href)
    }
  }
  return (
      <Container isPadding={false}>
        <Stack.Screen options={{title:'Profile', headerTitleAlign:'center',headerStyle: {
            backgroundColor: '#242121',
          },
          headerTintColor: '#fff',}}/>
        {/* <Text>ProfileScreen</Text> */}
        <View className='mt-1'>

        {buttons.map((button, index) => (
          <Pressable key={index} className='bg-black-600 w-full flex-row px-[27px] py-[16px] mb-2 items-center justify-between' onPress={()=>{handlePress(button.href)}}>
            <View className='flex-row items-center'>
              <Image source={button.img} className='mr-3  w-[25px] aspect-square' resizeMode='contain'/>
              <Text className='font-lexend_regular text-xl text-white'>{button.title}</Text>

            </View>
            <Image source={require('@/src/assets/icons/profile/arrow_dark.png')} className='w-[35px] aspect-square' resizeMode='contain'/>
          </Pressable>
        ))}
          </View>
      </Container>
  )
}