import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={styles.successContainer}>
      <Text style={styles.title}>{text1}</Text>
      {text2 ? <Text style={styles.message}>{text2}</Text> : null}
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View style={styles.errorContainer}>
      <Text style={styles.title}>{text1}</Text>
      {text2 ? <Text style={styles.message}>{text2}</Text> : null}
    </View>
  ),
}

export const styles = StyleSheet.create({
  successContainer: {
    backgroundColor: '#2A2A2A',
    borderLeftWidth: 6,
    borderLeftColor: '#16a34a',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  errorContainer: {
    backgroundColor: '#2A2A2A',
    borderLeftWidth: 6,
    borderLeftColor: '#f87171',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 10,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'LexendDeca-SemiBold',
  },
  message: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'LexendDeca-Light',
  },
})
