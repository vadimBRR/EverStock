import { useSupabase } from '@/src/providers/SupabaseProvider'
import { InsertTables, Tables } from '@/src/types/types'
import { client } from '@/src/utils/supabaseClient'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateItem = () => {
	const queryClient = useQueryClient()
	const { createItem } = useSupabase()
	return useMutation({
		mutationKey: ['item'],

		async mutationFn({
			folder_id,
      name,
			images,
			price,
			quantity,
			note,
      tag,
      typeAmount
		}: {
			folder_id: number
      name:string
			images: string[]
			price: number
			quantity: number
			note: string,
      tag: string,
      typeAmount: string
		}) {
			const data = await createItem!(
				folder_id,
        name,
				images,
				price,
				quantity,
				note,
        tag
			)
			return data
		},
		async onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['folders'],
			})
		},
	})
}

export const useUpdateItem = () => {
  const queryClient = useQueryClient()
  const { updateItem } = useSupabase()

  return useMutation({
    mutationKey: ['item', 'update'],
    mutationFn: async ({
      updatedItem,
      previousItem,
    }: {
      updatedItem: Tables<'items'>
      previousItem: Tables<'items'>
    }) => {
      if (!updateItem) throw new Error('updateItem is not available')
      return await updateItem(updatedItem, previousItem)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    },
  })
}


export const useDeleteItem = () => {
	const queryClient = useQueryClient()
	const { createTransaction } = useSupabase()

	return useMutation({
		mutationKey: ['item', 'delete'],
		mutationFn: async ({
			id,
			item,
		}: {
			id: number
			item: Tables<'items'>
		}) => {
			// // 🔁 1. Створюємо транзакцію ДО видалення
			await createTransaction?.(id, item.folder_id!, 'deleted', {
				prev_item: item,
				changed_item: null,
				changes: Object.keys(item),
			})

			// 🗑️ 2. Видаляємо item
			const { error } = await client.from('items').delete().eq('id', id)
			if (error) throw error
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] })
		},
	})
}


export const useCloneItem = () => {
	const queryClient = useQueryClient()
	const { createItem, createTransaction } = useSupabase()

	return useMutation({
		mutationKey: ['item', 'clone'],
		mutationFn: async (item: Tables<'items'>) => {
			const cloneName = item.name + ' (copy)'
			const cloned = await createItem?.(
				item.folder_id!,
				cloneName,
				item.image_url || [],
				item.price || 0,
				item.quantity || 0,
				item.note || '',
				item.tag || '',
				item.typeAmount || ''
			)

			const newItem = cloned?.[0]
			if (!newItem) throw new Error('Cloning failed')

			await createTransaction?.(newItem.id!, newItem.folder_id!, 'created', {
				prev_item: null,
				changed_item: newItem,
				changes: Object.keys(newItem),
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['folders'] })
		},
	})
}
