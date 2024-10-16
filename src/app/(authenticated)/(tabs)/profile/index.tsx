import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack, useRouter } from 'expo-router'
import { useAuth } from '@clerk/clerk-expo'

export default function ProfileScreen() {
  const router = useRouter()
  const {signOut} = useAuth()
  const buttons = [
    {img: require('@/src/assets/icons/profile/account.png'), title: 'Account', href: '/(authenticated)/(tabs)/profile/account'},
    {img: require('@/src/assets/icons/profile/theme.png'), title: 'Theme', href: '/(authenticated)/(tabs)/profile/theme'},
    {img: require('@/src/assets/icons/profile/export.png'), title: 'Export', href: '/(authenticated)/(tabs)/profile/export'},
    {img: require('@/src/assets/icons/profile/support.png'), title: 'Help & Support', href: '/(authenticated)/(tabs)/profile/support'},
    
    {img: require('@/src/assets/icons/profile/logout.png'), title: 'Logout', href: 'logout'},
  ]

  const handlePress = async (href: string) => {
    if(href === 'logout') {
      await signOut().then(() => {
        // router.replace('/')
      })
    } else {
      router.push(href)
    }
  }
  return (
      <Container isPadding={false}>
        <Stack.Screen options={{title:'Profile', headerTitleAlign:'center'}}/>
        {/* <Text>ProfileScreen</Text> */}
        <View className='mt-1'>

        {buttons.map((button, index) => (
          <Pressable key={index} className='bg-white w-full flex-row px-[27px] py-[16px] mb-2 items-center justify-between' onPress={()=>{handlePress(button.href)}}>
            <View className='flex-row items-center'>
              <Image source={button.img} className='mr-3  w-[25px] aspect-square' resizeMode='contain'/>
              <Text className='font-lexend_regular text-xl'>{button.title}</Text>

            </View>
            <Image source={require('@/src/assets/icons/arrow-right-dark.png')} className='' resizeMode='contain'/>
          </Pressable>
        ))}
          </View>
      </Container>
  )
}