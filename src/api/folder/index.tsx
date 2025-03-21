import { useSupabase } from '@/src/providers/SupabaseProvider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useCreateFolder = () => {
	const queryClient = useQueryClient()
	const { createFolder } = useSupabase()
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
			const data = await createFolder!(name, type, currency, options)
			return data
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
