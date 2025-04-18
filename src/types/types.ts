import { Database } from './database.types'

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];

  export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
  export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T];
  

export interface WarehouseUserType {
  id: string 
  fullName: string
  email: string
  roles: {
    isView: boolean
    isAddItem: boolean
    isDeleteItem: boolean
    isEdit: boolean
    isCanInvite: boolean
    isAdmin: boolean,
    isManager: false,
  } 
  permissions: string[]
  added_at: string | null
  folder_id: number | null
}
  
export type currencyType = {
	name: string
	value: string
	countries: string[]
}

export type folderType = {
	created_at: string
  lastUpdated: string
	currency: currencyType
	id: number
	name: string
	options: string[]
	type: string
	members: {
		id: number
		email: string
		fullName: string
		roles: {
			isView: boolean
			isAddItem: boolean
			isDeleteItem: boolean
			isEdit: boolean
			isCanInvite: boolean,
      isManager: boolean,
			isAdmin: boolean
		}
	}[]
	totalPrice: number
	totalQuantity: number
	totalMembers: number
}

export type itemType = {
	created_at: string
	folder_id: number
	id: number
	image_url: string[]
	name: string
	note: string
	price: number
	typeAmount: string
	amount: number
	quantity: number
	user_id: string
	tag: string
}

export type accountType = {
	id: number
	email: string
	first_name: string
	last_name: string
	roles: {
		isView: boolean
		isAddItem: boolean
		isDeleteItem: boolean
		isEdit: boolean
		isCanInvite: boolean,
    isManager: boolean,
		isAdmin: boolean
	}
}

export type warehouseUserRoles = {
    isView: boolean
    isAddItem: boolean
    isDeleteItem: boolean
    isEdit: boolean
    isCanInvite: boolean
    isAdmin: boolean,
    isManager: boolean,
}
export type FolderWithUsers = Tables<'folders'> & {
  warehouse_users: {
    user_id: string
    roles: Record<string, warehouseUserRoles>
  }[]
}
export type transactionType = {
	folder_id: number
	info: infoTransactionType[]
	amount_changes: {
		date: string
		value: number
	}[]

	price_changes: {
		date: string
		value: number
	}[]
}

export type infoTransactionType = {
	id: number
	user_id: number
	item_id: number
	prev_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>
	changed_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>
	changes: (keyof itemType)[]
	date: string
	isCreated?: boolean
	isEdited?: boolean
	isDeleted?: boolean
	isReverted?: boolean
}
