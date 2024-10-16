import { useSupabase } from '@/src/providers/SupabaseProvider'
import { useQuery } from '@tanstack/react-query'

export const useGetUserById = () => {
  const {getUserInfo} = useSupabase();
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const data = await getUserInfo!();
      console.log("data2");
      console.log(data);
      
      return data
    }
  })
}