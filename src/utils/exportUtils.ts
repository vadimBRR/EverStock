import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'
import * as DocumentPicker from 'expo-document-picker'
import * as MediaLibrary from 'expo-media-library'

export const exportToJSON = async (data: any, filename = 'items_export.json') => {
  const fileUri = FileSystem.documentDirectory + filename
  await FileSystem.writeAsStringAsync(fileUri, JSON.stringify(data, null, 2), {
    encoding: FileSystem.EncodingType.UTF8,
  })
  await Sharing.shareAsync(fileUri)
}

export const exportToCSV = async (data: any[], filename = 'items_export.csv') => {
  const header = Object.keys(data[0] || {}).join(',')
  const rows = data.map(obj => Object.values(obj).join(','))
  const csv = [header, ...rows].join('\n')

  const fileUri = FileSystem.documentDirectory + filename
  await FileSystem.writeAsStringAsync(fileUri, csv, {
    encoding: FileSystem.EncodingType.UTF8,
  })
  await Sharing.shareAsync(fileUri)
}
