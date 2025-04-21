import Toast from 'react-native-toast-message'

export const showSuccess = (msg: string, sub?: string) =>
	Toast.show({ type: 'success', text1: msg, text2: sub })

export const showError = (msg: string, sub?: string) =>
	Toast.show({ type: 'error', text1: msg, text2: sub })

export const showInfo = (msg: string, sub?: string) =>
	Toast.show({ type: 'info', text1: msg, text2: sub })
