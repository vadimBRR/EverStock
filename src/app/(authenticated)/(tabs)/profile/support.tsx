import { View, Text, Linking } from 'react-native'
import React from 'react'
import Container from '@/src/components/Container'
import { Stack } from 'expo-router'
import { FontAwesome5, Ionicons } from '@expo/vector-icons'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function SupportScreen() {
  const handleEmailPress = () => {
    Linking.openURL('mailto:vadmabos.programming@gmail.com')
  }

  const handleTelegramPress = () => {
    Linking.openURL('https://t.me/vadimbrovich')
  }

  return (
    <Container isPadding={false}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Support',
          headerStyle: {
            backgroundColor: '#242121',
          },
          headerTintColor: '#fff',
          headerTitleAlign: 'center',
        }}
      />
      <View className='flex-1 px-5 py-6'>
        <Text className='text-white text-[22px] font-lexend_medium mb-6'>
          Contact us:
        </Text>

        <TouchableOpacity
          onPress={handleEmailPress}
          className='flex-row items-center mb-4'
        >
          <Ionicons name='mail-outline' size={22} color='white' />
          <Text className='text-white text-[16px] ml-3'>
            vadmabos.programming@gmail.com
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleTelegramPress}
          className='flex-row items-center'
        >
          <FontAwesome5 name='telegram-plane' size={20} color='white' />
          <Text className='text-white text-[16px] ml-3'>@vadimbrovich</Text>
        </TouchableOpacity>

        <View className='mt-8'>
          <Text className='text-gray text-sm font-lexend_light'>
            If you have any issues, feedback, or just want to say hi — we’d love to hear from you!
          </Text>
        </View>
      </View>
    </Container>
  )
}
