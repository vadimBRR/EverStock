import { useSupabase } from '@/src/providers/SupabaseProvider'
import { client } from '@/src/utils/supabaseClient'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

export const useGetUserById = () => {
  const {getUserInfo} = useSupabase();
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const data = await getUserInfo!();
      
      return data
    }
  })
}

export const useGetWarehouseUsers = (folderId: number) => {
	const { getWarehouseUsers } = useSupabase()

	return useQuery({
		queryKey: ['warehouse_users', folderId],
		queryFn: async () => {
			const data = await getWarehouseUsers!(folderId)
			return data
		},
		enabled: !!folderId,
	})
}

export const useAddWarehouseMember = () => {
  const queryClient = useQueryClient()
  const { addMemberToWarehouse } = useSupabase()

  return useMutation({
    mutationKey: ['add-warehouse-member'],
    mutationFn: async ({
      folderId,
      email,
      roles,
      permissions,
    }: {
      folderId: number
      email: string
      roles: Record<string, boolean>
      permissions: string[]
    }) => {
      return await addMemberToWarehouse!({ folderId, email, roles, permissions })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse_users'] })
    },
  })
}

export const useGetAllUsers = () => {
  console.log("we here!");

  return useQuery({
    queryKey: ['all-users'],
    queryFn: async () => {
      const { data, error } = await client.from('users').select('email, full_name')

      if (error) {
        console.error('Failed to fetch all users:', error)
        return []
      }

      return data || []
    },
  })
}

export const useUpdateWarehouseMember = () => {
	const { userId } = useSupabase()
  const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['update-member'],
		mutationFn: async ({
			folderId,
			userId,
			roles,
		}: {
			folderId: number
			userId: string
			roles: Record<string, boolean>
		}) => {
			const { error } = await client
				.from('warehouse_users')
				.update({ roles })
				.eq('folder_id', folderId)
				.eq('user_id', userId)

			if (error) throw error
		},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse_users'] })
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
    },
	})
}

export const useDeleteWarehouseMember = () => {
  const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-member'],
		mutationFn: async ({
			folderId,
			userId,
		}: {
			folderId: number
			userId: string
		}) => {
			const { error } = await client
				.from('warehouse_users')
				.delete()
				.eq('folder_id', folderId)
				.eq('user_id', userId)

			if (error) throw error
		},
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouse_users'] })
      queryClient.invalidateQueries({ queryKey: ['all-users'] })
    },
	})
}

export const useFolderMembersMap = (folderId: number) => {
  const { getWarehouseUsers } = useSupabase()

  return useQuery({
    queryKey: ['folder-members-map', folderId],
    enabled: !!folderId,
    queryFn: async () => {
      const users = await getWarehouseUsers!(folderId)
      const map = new Map<string, string>()
      users.forEach(user => {
        map.set(user.id, user.fullName)
      })
      return map
    },
  })
}
