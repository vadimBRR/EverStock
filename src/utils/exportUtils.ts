import * as FileSystem from 'expo-file-system'
import * as Sharing from 'expo-sharing'

export const exportItemsAsJSON = async (items: any[]) => {
  const jsonString = JSON.stringify(items, null, 2)
  const fileUri = FileSystem.documentDirectory + 'items_export.json'
  await FileSystem.writeAsStringAsync(fileUri, jsonString, {
    encoding: FileSystem.EncodingType.UTF8,
  })

  await Sharing.shareAsync(fileUri)
}

export const exportItemsAsCSV = async (items: any[]) => {
  if (items.length === 0) return

  const headers = Object.keys(items[0]).join(',')
  const rows = items.map(item =>
    Object.values(item)
      .map(val => `"${String(val).replace(/"/g, '""')}"`)
      .join(',')
  )

  const csvString = [headers, ...rows].join('\n')
  const fileUri = FileSystem.documentDirectory + 'items_export.csv'
  await FileSystem.writeAsStringAsync(fileUri, csvString, {
    encoding: FileSystem.EncodingType.UTF8,
  })

  await Sharing.shareAsync(fileUri)
}
