import { useSupabase } from '@/src/providers/SupabaseProvider'
import {  useQuery } from '@tanstack/react-query'

export const useGetTransaction = (folderId: number) => {
  const { getTransactions } = useSupabase()

  return useQuery({
    queryKey: ['transactions', folderId],
    enabled: folderId !== -1,
    queryFn: async () => {
      const data = await getTransactions!(folderId)

      const formattedTransaction = {
        folder_id: folderId,
        info: data.map((t: any) => ({
          id: t.id,
          user_id: t.user_id,
          item_id: t.item_id,
          prev_item: t.prev_item || {},
          changed_item: t.changed_item || {},
          changes: t.changes || [],
          date: t.timestamp ? t.timestamp : '',
          isCreated: t.action === 'created',
          isEdited: t.action === 'edited',
          isDeleted: t.action === 'deleted',
          isReverted: t.action === 'reverted',
        })),
        amount_changes: [],
        price_changes: [],
      }

      return formattedTransaction
    },
  })
}
