import { createContext, useContext, useEffect, useState } from 'react'
import { client } from '../utils/supabaseClient'
import { useAuth } from '@clerk/clerk-expo'
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { InsertTables, Tables, WarehouseUserType } from '../types/types'

export const USERS_TABLE = 'users'
export const FOLDERS_TABLE = 'folders'
export const ITEMS_TABLE = 'items'
export const TRANSACTIONS_TABLE = 'transactions'
export const WAREHOUSE_USERS_TABLE = 'warehouse_users'

type ProviderProps = {
	userId: string | null
	createFolder: (
		name: string,
		type: string,
		currency: string,
		options: string[] | []
	) => Promise<InsertTables<'folders'>[] | null>
	getFolders: () => Promise<Tables<'folders'>[]>
	createItem: (
		folderId: number,
		name: string,
		images: string[],
		price: number,
		quantity: number,
		note: string,
		tag?: string,
		typeAmount?: string,
    min_quantity?: number
	) => Promise<InsertTables<'items'>[] | null>
	getItems: (folderId: number) => Promise<Tables<'items'>[]>
	getFoldersWithStatistic: () => Promise<
		| (Tables<'folders'> & {
				totalPrice: number
				totalQuantity: number
				totalMembers: number
				lastUpdated: Date
				items: Tables<'items'>[]
				warehouse_users: Tables<'warehouse_users'>[]
		  })[]
		| null
	>
	updateFolder: (
		id: number,
		name: string,
		currency: string,
		type: string,
		options: string[]
	) => Promise<any>
	updateItem: (
		updatedItem: Tables<'items'>,
		previousItem: Tables<'items'>
	) => Promise<any>
	createTransaction: (
		itemId: number,
		folderId: number,
		action: string,
    extras?: {
      prev_item?: any
      changed_item?: any,
      changes?: any[]
    }
	) => Promise<any>
	getTransactions: (folderId: number) => Promise<Tables<'transactions'>[]>
	getWarehouseUsers: (folderId: number) => Promise<WarehouseUserType[]>
	getUserInfo: () => Promise<any>
	updateUserInfo: (updates: any) => Promise<any>
  revertItemToPreviousState: (transactionId: number, folderId: number) => Promise<any>
  deleteItem: (item_id: number, folder_id: number) => Promise<any>
  cloneItem: (item_id: number) => Promise<any>
	getRealtimeItemsSubscription: (
		handleRealtimeChanges: (update: RealtimePostgresChangesPayload<any>) => void
	) => any
	addMemberToWarehouse: (params: {
		folderId: number,
		email: string,
		roles: Record<string, boolean>,
		permissions: string[]}
	) => Promise<any>
}

const SupabaseContext = createContext<Partial<ProviderProps>>({})

export function useSupabase() {
	return useContext(SupabaseContext)
}

export const SupabaseProvider = ({ children }: any) => {
	const { userId, isSignedIn } = useAuth()
	const [user, setUser] = useState<string | null>(null)

	useEffect(() => {
		if (isSignedIn && userId) {
			console.log('User signed in, updating userId...')
			setUser(userId)
		}
	}, [isSignedIn, userId])

	useEffect(() => {
		setRealtimeAuth()
	}, [])

	const setRealtimeAuth = async () => {
		const clerkToken = await window.Clerk?.session?.getToken({
			template: 'supabase',
		})

		client.realtime.setAuth(clerkToken!)
	}

	const createFolder = async (
		name: string,
		type: string,
		currency: string,
		options: string[] | []
	) => {
		const { data, error } = await client
			.from(FOLDERS_TABLE)
			.insert({
				name,
				user_id: userId,
				created_at: new Date(),
				type,
				currency,
				options,
			})
			.select()

		if (error) {
			console.error('Error creating folder:', error)
		}

		return data
	}

	const getFolders = async () => {
		const { data } = await client
			.from(FOLDERS_TABLE)
			.select('*')
			.eq('user_id', userId)
		return data || []
	}

	const createItem = async (
		folderId: number,
		name: string,
		images: string[],
		price: number,
		quantity: number,
		note: string,
		tag?: string,
		typeAmount?: string,
    min_quantity?: number
	) => {
		const { data, error } = await client
			.from(ITEMS_TABLE)
			.insert({
				folder_id: folderId,
				name: name,
				user_id: userId,
				image_url: images,
				price,
				quantity: quantity || 0,
				note,
				tag,
				typeAmount,
				created_at: new Date(),
        min_quantity: min_quantity || 0
			})
			.select()

		if (error) {
			console.error('Error creating item:', error)
		}

		return data
	}

	const updateItem = async (
		updatedItem: Tables<'items'>,
		previousItem: Tables<'items'>
	) => {
		const { id, folder_id, ...rest } = updatedItem

		const { data, error } = await client
			.from(ITEMS_TABLE)
			.update({ ...rest, updated_at: new Date() })
			.eq('id', id)
			.select()

		if (error) {
			console.error('Error updating item:', error)
		}

		const changes = Object.keys(rest).filter(
			key =>
				rest[key as keyof typeof rest] !==
				previousItem[key as keyof typeof previousItem]
		)

		const amountChange =
			(updatedItem.quantity || 0) - (previousItem.quantity || 0)
		const priceChange = (updatedItem.price || 0) - (previousItem.price || 0)

		let action = 'edited'
		// if (changes.includes("quantity") && changes.includes("price")) {
		//   action = "updated quantity & price";
		// } else if (changes.includes("quantity")) {
		//   action = "updated quantity";
		// } else if (changes.includes("price")) {
		//   action = "updated price";
		// }

		const { error: transactionError } = await client
			.from(TRANSACTIONS_TABLE)
			.insert({
				item_id: id,
				folder_id,
				user_id: userId,
				prev_item: previousItem,
				changed_item: updatedItem,
				changes,
				isedited: true,
				amountchange: amountChange,
				pricechange: priceChange,
				action, 
				timestamp: new Date(),
			})

		if (transactionError) {
			console.error('Error creating transaction:', transactionError)
		}

		return data
	}

	const getItems = async (folderId: number) => {
		const { data } = await client
			.from(ITEMS_TABLE)
			.select('*')
			.eq('folder_id', folderId)
		return data || []
	}
  const getFoldersWithStatistic = async () => {
    const { data: ownerFolders, error: ownerError } = await client
      .from(FOLDERS_TABLE)
      .select('*, items(*), warehouse_users(*)')
      .eq('user_id', userId)
  
    if (ownerError) {
      console.error('Error getting owned folders:', ownerError)
    }
  
    const { data: warehouseMemberships, error: memberError } = await client
      .from('warehouse_users')
      .select('folder_id')
      .eq('user_id', userId)
  
    if (memberError) {
      console.error('Error getting memberships:', memberError)
      return []
    }
  
    const folderIds = warehouseMemberships.map(m => m.folder_id)
  
    let memberFolders: any[] = []
    if (folderIds.length > 0) {
      const { data, error } = await client
        .from(FOLDERS_TABLE)
        .select('*, items(*), warehouse_users(*)')
        .in('id', folderIds)
  
      if (error) {
        console.error('Error getting member folders:', error)
      } else {
        memberFolders = data
      }
    }
  
    const allFoldersRaw = [...(ownerFolders || []), ...memberFolders]
    const allFolders = Array.from(
      new Map(allFoldersRaw.map(folder => [folder.id, folder])).values()
    )
  
    const foldersWithStatistic = allFolders.map(folder => {
      const warehouseUsers = Array.isArray(folder.warehouse_users)
        ? folder.warehouse_users
        : folder.warehouse_users
        ? [folder.warehouse_users]
        : []
  
      const totalPrice = folder.items.reduce(
        (sum: number, item: { price: number; quantity: number }) =>
          sum + item.price * item.quantity,
        0
      )
  
      const totalQuantity = folder.items.reduce(
        (sum: number, item: { quantity: number }) => sum + item.quantity,
        0
      )
  
      const totalMembers = warehouseUsers.length
  
      const lastUpdatedItem = folder.items.reduce(
        (latest: string, item: { updated_at: string }) =>
          item.updated_at &&
          (!latest || new Date(item.updated_at) > new Date(latest))
            ? item.updated_at
            : latest,
        null
      )
  
      const lastUpdatedUser = warehouseUsers.reduce(
        (latest: string, user: { added_at: string }) =>
          user.added_at &&
          (!latest || new Date(user.added_at) > new Date(latest))
            ? user.added_at
            : latest,
        null
      )
  
      const lastUpdated = [lastUpdatedItem, lastUpdatedUser, folder.created_at].reduce(
        (latest, date) =>
          date && (!latest || new Date(date) > new Date(latest)) ? date : latest,
        null
      )
  
      const { items, warehouse_users, ...folderWithoutItems } = folder
  
      return {
        ...folderWithoutItems,
        totalPrice,
        totalQuantity,
        totalMembers,
        lastUpdated,
        items,
        warehouse_users: warehouseUsers,
      }
    })
  
    return foldersWithStatistic
  }
  

	const updateFolder = async (
		id: number,
		name: string,
		type: string,
		currency: string,
		options: string[]
	): Promise<InsertTables<'folders'>[] | null> => {
		const { data, error } = await client
			.from(FOLDERS_TABLE)
			.update({
				name,
				type,
				currency,
				options,
				updated_at: new Date(),
			})
			.eq('id', id)
			.select()

		if (error) {
			console.error('Error updating folder:', error)
		}
		return data
	}

	const createTransaction = async (
    itemId: number,
    folderId: number,
    action: string,
    extras?: {
      prev_item?: any
      changed_item?: any
      changes?: string[]
    }
  ) => {
    const { data, error } = await client
      .from(TRANSACTIONS_TABLE)
      .insert({
        item_id: itemId,
        folder_id: folderId,
        action,
        user_id: userId,
        timestamp: new Date(),
        isedited: action === 'edited',
        prev_item: extras?.prev_item || null,
        changed_item: extras?.changed_item || null,
        changes: extras?.changes || [],
      })
      .select()
  
    if (error) {
      console.error('Error creating transaction:', error)
    }
  
    return data
  }
  
	const getTransactions = async (folderId: number) => {
		const { data } = await client
			.from(TRANSACTIONS_TABLE)
			.select('*')
			.eq('folder_id', folderId)
		return data || []
	}

	const getWarehouseUsers = async (folderId: number) => {
		const { data, error } = await client
			.from(WAREHOUSE_USERS_TABLE)
			.select('*, users(full_name, email)')
			.eq('folder_id', folderId)

		if (error) {
			console.error('Error fetching warehouse users:', error)
			return []
		}

		return data.map(user => ({
			id: user.user_id,
			fullName: user.users?.full_name || '',
			email: user.users?.email || '',
			roles: user.roles,
			permissions: user.permissions,
			added_at: user.added_at,
			folder_id: user.folder_id,
		}))
	}

	const getUserInfo = async () => {
		const { data } = await client
			.from(USERS_TABLE)
			.select('*')
			.eq('id', userId)
			.single()
		return data
	}

	const updateUserInfo = async (updates: any) => {
		const { data, error } = await client
			.from(USERS_TABLE)
			.update(updates)
			.eq('id', userId)
			.select()

		if (error) {
			console.error('Error updating user info:', error)
		}

		return data
	}

	const addMemberToWarehouse = async ({
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
    console.log("email to find: ", email);
    const allUsers = await client.from('users').select('*')
    console.log('All users:', allUsers.data)

    const user = allUsers.data?.find(u => u.email?.trim() === email.trim())
    if (!user) {
      throw new Error('User with this email not found.')
    }
    const userId = user.id
		// const { data: user, error: userError } = await client
		// 	.from('users')
		// 	.select('id')
		// 	.eq('email', email.trim().toLowerCase()).maybeSingle()
			

		// if (userError || !user) {
		// 	throw new Error('User with this email not found.')
		// }

		// const userId = user.id

		const { data: existing, error: existingError } = await client
			.from('warehouse_users')
			.select('*')
			.eq('folder_id', folderId)
			.eq('user_id', userId)
			.single()

		if (existing) {
			throw new Error('User is already a member of this warehouse.')
		}

		const { data, error } = await client
			.from('warehouse_users')
			.insert({
				folder_id: folderId,
				user_id: userId,
				roles,
				permissions,
				added_at: new Date().toISOString(),
			})
			.select()

		if (error) {
			throw new Error('Failed to add member.')
		}

		return data
	}

  const revertItemToPreviousState = async (
    transactionId: number,
    folderId: number
  ) => {
    const { data: transaction, error: fetchError } = await client
      .from(TRANSACTIONS_TABLE)
      .select('*')
      .eq('id', transactionId)
      .single()
  
    if (fetchError) {
      console.error('Error fetching transaction:', fetchError)
      return null
    }
  
    const prevItem = transaction.prev_item
    const itemId = transaction.item_id
  
    if (!prevItem || !itemId) {
      console.warn('No previous item found for transaction.')
      return null
    }
  
    const { error: updateError } = await client
      .from(ITEMS_TABLE)
      .update({
        ...prevItem,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
  
    if (updateError) {
      console.error('Error reverting item:', updateError)
      return null
    }
  
    const { error: logError } = await client.from(TRANSACTIONS_TABLE).insert({
      action: 'reverted',
      folder_id: folderId,
      item_id: itemId,
      user_id: userId,
      prev_item: transaction.changed_item,
      changed_item: prevItem,
      changes: transaction.changes,
      isreverted: true,
      timestamp: new Date().toISOString(),
    })
  
    if (logError) {
      console.error('Error logging revert transaction:', logError)
    }
  
    return true
  }

  const deleteItem = async (item_id: number, folder_id: number) => {
    const { error } = await client
      .from('items')
      .delete()
      .eq('id', item_id)
  
    if (error) throw new Error('Failed to delete item')
  
    const { error: txError } = await client.from('transactions').insert({
      item_id,
      folder_id, 
      user_id: userId,
      action: 'deleted',
      timestamp: new Date(),
    })
  
    if (txError) console.error('Error logging delete transaction:', txError)
  
    return true
  }

  const cloneItem = async (item_id: number) => {
    const { data, error } = await client
      .from('items')
      .select('*')
      .eq('id', item_id)
      .single()
  
    if (error || !data) throw new Error('Original item not found')
  
    const cloned = {
      ...data,
      name: data.name + ' (Copy)',
      created_at: new Date(),
      updated_at: new Date(),
    }
  
    delete cloned.id
  
    const { data: newItem, error: insertError } = await client
      .from('items')
      .insert(cloned)
      .select()
      .single()
  
    if (insertError) throw new Error('Failed to clone item')
  
    const { error: txError } = await client.from('transactions').insert({
      item_id: newItem.id,
      folder_id: newItem.folder_id,
      user_id: userId,
      action: 'created',
      timestamp: new Date(),
    })
  
    if (txError) console.error('Error logging clone transaction:', txError)
  
    return newItem
  }
  
  
  
	const getRealtimeItemsSubscription = (
		handleRealtimeChanges: (update: RealtimePostgresChangesPayload<any>) => void
	) => {
		return client
			.channel(`item-changes-${userId}`)
			.on(
				'postgres_changes',
				{ event: '*', schema: 'public', table: ITEMS_TABLE },
				handleRealtimeChanges
			)
			.subscribe()
	}

	const value = {
		userId: user,
		createFolder,
		getFolders,
		createItem,
		getItems,
		updateItem,
		createTransaction,
		getTransactions,
		getUserInfo,
		updateUserInfo,
		getRealtimeItemsSubscription,
		getFoldersWithStatistic,
		updateFolder,
		getWarehouseUsers,
		addMemberToWarehouse,
    revertItemToPreviousState,
    deleteItem,
    cloneItem
	}

	return (
		<SupabaseContext.Provider value={value}>
			{children}
		</SupabaseContext.Provider>
	)
}
