import { useSupabase } from '@/src/providers/SupabaseProvider'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useCreateFolder = () => {
  const {createFolder} = useSupabase();
  return useMutation({
    mutationKey: ['folder'],

    mutationFn: async ({name, currency, folderType, options}:{name: string, currency: string, folderType: string, options: string[] | []}) => {
      const type = folderType
      const data = await createFolder!(name, type,currency, options);
      return data;
    },
  })
}

export const useGetFolders = () => {
  const {getFolders} = useSupabase();
  return useQuery({
    queryKey: ['folder'],
    queryFn: async () => {
      const data = await getFolders!();
      return data;
    },
  })
}

export const useGetFolderWithItems = () => {
  const {getFoldersWithStatistic} = useSupabase();
  
  return useQuery({
    queryKey: ['folder items'],

    queryFn: async () => {
      const data = await getFoldersWithStatistic!();
      return data;
    },
  })
}



