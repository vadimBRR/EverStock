import { useSupabase } from '@/src/providers/SupabaseProvider'
import { client } from '@/src/utils/supabaseClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCreateFolder = () => {
	const queryClient = useQueryClient()
	const { createFolder, userId } = useSupabase()

	return useMutation({
		mutationKey: ['folder'],

		async mutationFn({
			name,
			currency,
			folderType,
			options,
		}: {
			name: string
			currency: string
			folderType: string
			options: string[] | []
		}) {
			const type = folderType
			const folderData = await createFolder!(name, type, currency, options)

			const folder = folderData?.[0]
			if (!folder) throw new Error('Failed to create folder.')

			// ✅ Додаємо власника в warehouse_users
			const { error } = await client.from('warehouse_users').insert({
				folder_id: folder.id,
				user_id: userId,
				roles: {
					isView: true,
					isAddItem: true,
					isDeleteItem: true,
					isEdit: true,
					isCanInvite: true,
					isAdmin: true,
          isManager: false,
				},
				permissions: [],
				added_at: new Date().toISOString(),
			})

			if (error) {
				console.error('Failed to add owner to warehouse_users:', error)
			}

			return folderData
		},

		async onSuccess() {
			queryClient.invalidateQueries({
				queryKey: ['folders'],
			})
		},
	})
}


// export const useGetFolders = () => {
//   const {getFolders} = useSupabase();
//   return useQuery({
//     queryKey: ['folder'],
//     queryFn: async () => {
//       const data = await getFolders!();
//       return data;
//     },
//   })
// }

export const useGetFoldersWithItems = () => {
	const { getFoldersWithStatistic } = useSupabase()

	return useQuery({
		queryKey: ['folders'],

		queryFn: async () => {
      console.log("get folders");
			const data = await getFoldersWithStatistic!()
			return data
		},  
	})
}
