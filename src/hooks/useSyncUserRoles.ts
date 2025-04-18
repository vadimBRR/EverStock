import { useEffect } from 'react'
import { useGetUserById } from '@/src/api/users'
import { useRolesStore } from '../store/useUserRoles'
import { FolderWithUsers } from '../types/types'

export const useSyncUserRoles = (folder: FolderWithUsers | undefined) => {
  const { data: currentUser } = useGetUserById()
  const setRoles = useRolesStore(state => state.setRoles)

  useEffect(() => {
    if (!folder || !currentUser) return

    const currentMember = folder.warehouse_users.find(
      wu => wu.user_id === currentUser.id
    )

    if (currentMember?.roles) {
      console.log("SET ROLESSS!");
      console.log(currentMember.roles);
      setRoles(currentMember.roles) 

    }
  }, [folder, currentUser])
}
