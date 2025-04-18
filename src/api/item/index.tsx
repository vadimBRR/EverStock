import { useSupabase } from '@/src/providers/SupabaseProvider'
import { InsertTables, Tables } from '@/src/types/types'
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
