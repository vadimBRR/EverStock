import { View, Text } from 'react-native'
import React from 'react'
import Container from '../components/Container'
import { Redirect } from 'expo-router'

export default function SSOCallback() {
  
  return (
    <Redirect href="/(authenticated)/(tabs)/home/folder" />
  )
}