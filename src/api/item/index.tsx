import { useSupabase } from '@/src/providers/SupabaseProvider'
import { InsertTables } from '@/src/types/types'
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
		}: {
			folder_id: number
      name:string
			images: string[]
			price: number
			quantity: number
			note: string
		}) {
			const data = await createItem!(
				folder_id,
        name,
				images,
				price,
				quantity,
				note
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
