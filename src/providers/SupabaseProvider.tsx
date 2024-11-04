import { createContext, useContext, useEffect } from 'react';
import { client } from '../utils/supabaseClient';
import { useAuth } from '@clerk/clerk-expo';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { InsertTables, Tables } from '../types/types'

export const USERS_TABLE = 'users';
export const FOLDERS_TABLE = 'folders';
export const ITEMS_TABLE = 'items';
export const TRANSACTIONS_TABLE = 'transactions';
export const WAREHOUSE_USERS_TABLE = 'warehouse_users';

type ProviderProps = {
  userId: string | null;
  createFolder: (name: string, type: string, currency: string, options: string[] | []) => Promise<InsertTables<'folders'>[] | null>;
  getFolders: () => Promise<Tables<'folders'>[]>;
  createItem: (folderId: number,name:string, images: string[], price: number, quantity: number, note:string) => Promise<InsertTables<'items'>[] | null>;
  getItems: (folderId: number) => Promise<Tables<'items'>[]>;
  getFoldersWithStatistic: () => Promise<(Tables<'folders'> & { totalPrice: number, totalQuantity: number, totalMembers: number, lastUpdated: Date, items: Tables<'items'>[], warehouse_users: Tables<'warehouse_users'> })[] | null>;


  createTransaction: (itemId: number, folderId: number, action: string) => Promise<any>;
  getTransactions: (folderId: number) => Promise<Tables<'transactions'>[]>;
  getUserInfo: () => Promise<any>;
  updateUserInfo: (updates: any) => Promise<any>;
  getRealtimeItemsSubscription: (
    handleRealtimeChanges: (update: RealtimePostgresChangesPayload<any>) => void
  ) => any;
};

const SupabaseContext = createContext<Partial<ProviderProps>>({});

export function useSupabase() {
  return useContext(SupabaseContext);
}

export const SupabaseProvider = ({ children }: any) => {
  const { userId } = useAuth();

  useEffect(() => {
    setRealtimeAuth();
  }, []);

  const setRealtimeAuth = async () => {
    const clerkToken = await window.Clerk?.session?.getToken({
      template: 'supabase',
    });

    client.realtime.setAuth(clerkToken!);
  };

  const createFolder = async (name: string, type: string, currency: string, options: string[] | []) => {
    const { data, error } = await client
      .from(FOLDERS_TABLE)
      .insert({ name, user_id: userId, created_at: new Date(), type, currency, options }).select();

    if (error) {
      console.error('Error creating folder:', error);
    }

    return data;
  };

  const getFolders = async () => {
    const { data } = await client.from(FOLDERS_TABLE).select('*').eq('user_id', userId);
    return data || [];
  };

  const createItem = async (folderId: number,name:string, images: string[], price: number, quantity: number, note:string) => {
    const { data, error } = await client
      .from(ITEMS_TABLE)
      .insert({ folder_id: folderId,name:name, user_id: userId, image_url: images, price, quantity, note, created_at: new Date() }).select();

    if (error) {
      console.error('Error creating item:', error);
    }

    return data;
  };

  const getItems = async (folderId: number) => {
    const { data } = await client.from(ITEMS_TABLE).select('*').eq('folder_id', folderId);
    return data || [];
  };

   const getFoldersWithStatistic = async () => {
    const { data, error } = await client.from(FOLDERS_TABLE).select('*, items(*), warehouse_users(*)').eq('user_id', userId);

    if (error) {
      console.error('Error getting folders with items:', error);
    }
    
    if (data) {
      const foldersWithStatistic = data.map(folder => {
        const totalPrice = folder.items.reduce((sum: number, item: { price: number, quantity: number }) => sum + item.price * item.quantity, 0) 
      
        const totalQuantity = folder.items.reduce((sum: number, item: { price: number, quantity: number }) => sum + item.quantity, 0);
        const totalMembers = folder.warehouse_users.length +1;

        const lastUpdatedItem = folder.items.reduce(
          (latest: string | null, item: { updated_at: string | null }) => {
            return item.updated_at && (!latest || new Date(item.updated_at) > new Date(latest))
              ? item.updated_at
              : latest;
          },
          null
        );
  
        const lastUpdatedUser = folder.warehouse_users.reduce(
          (latest: string | null, user: { added_at: string | null }) => {
            return user.added_at && (!latest || new Date(user.added_at) > new Date(latest))
              ? user.added_at
              : latest;
          },
          null
        );
  
        const lastUpdated = [lastUpdatedItem, lastUpdatedUser, folder.created_at].reduce(
          (latest: string | null, date: string | null) => {
            return date && (!latest || new Date(date) > new Date(latest)) ? date : latest;
          },
          null
        );

        const { items, warehouse_users,  ...folderWithoutItems } = folder; 
        return { ...folderWithoutItems, totalPrice, totalQuantity,totalMembers, lastUpdated,items, warehouse_users }; 
      });

      return foldersWithStatistic;
    }
    return [];
  };

  const createTransaction = async (itemId: number, folderId: number, action: string) => {
    const { data, error } = await client
      .from(TRANSACTIONS_TABLE)
      .insert({ item_id: itemId, folder_id: folderId, action, user_id: userId, timestamp: new Date() }).select();

    if (error) {
      console.error('Error creating transaction:', error);
    }

    return data;
  };

  const getTransactions = async (folderId: number) => {
    const { data } = await client.from(TRANSACTIONS_TABLE).select('*').eq('folder_id', folderId);
    return data || [];
  };

  const getUserInfo = async () => {
    const { data } = await client.from(USERS_TABLE).select('*').eq('id', userId).single();
    console.log("data");
    console.log(data);
    return data;
  };

  const updateUserInfo = async (updates: any) => {
    const { data, error } = await client.from(USERS_TABLE).update(updates).eq('id', userId).select();

    if (error) {
      console.error('Error updating user info:', error);
    }

    return data;
  };

  const getRealtimeItemsSubscription = (
    handleRealtimeChanges: (update: RealtimePostgresChangesPayload<any>) => void
  ) => {
    console.log('Creating a realtime connection for items...');

    return client
      .channel(`item-changes-${userId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: ITEMS_TABLE },
        handleRealtimeChanges
      )
      .subscribe();
  };

  const value = {
    userId,
    createFolder,
    getFolders,
    createItem,
    getItems,
    createTransaction,
    getTransactions,
    getUserInfo,
    updateUserInfo,
    getRealtimeItemsSubscription,
    getFoldersWithStatistic
  };

  return <SupabaseContext.Provider value={value}>{children}</SupabaseContext.Provider>;
};
