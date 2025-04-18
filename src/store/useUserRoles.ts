// src/store/useUserRoles.ts
import { create } from 'zustand'
import { warehouseUserRoles } from '../types/types'

interface RolesStore {
  roles: warehouseUserRoles | null
  setRoles: (roles: warehouseUserRoles) => void
  clearRoles: () => void
}

export const useRolesStore = create<RolesStore>()((set) => ({
  roles: null,
  setRoles: (roles) => set({ roles }),
  clearRoles: () => set({ roles: null }),
}))
