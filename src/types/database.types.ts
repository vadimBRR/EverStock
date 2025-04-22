export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[]

export type Database = {
	public: {
		Tables: {
			folders: {
				Row: {
					created_at: string | null
					currency: string | null
					id: number
					name: string
					options: string[] | null
					type: string | null
					updated_at: string | null
					user_id: string
				}
				Insert: {
					created_at?: string | null
					currency?: string | null
					id?: number
					name: string
					options?: string[] | null
					type?: string | null
					updated_at?: string | null
					user_id: string
				}
				Update: {
					created_at?: string | null
					currency?: string | null
					id?: number
					name?: string
					options?: string[] | null
					type?: string | null
					updated_at?: string | null
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'folders_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
			items: {
				Row: {
					created_at: string | null
					folder_id: number | null
					id: number
					image_url: string[] | null
					min_quantity: number | null
					name: string
					note: string | null
					price: number | null
					quantity: number | null
					tag: string | null
					typeAmount: string | null
					updated_at: string | null
					user_id: string
				}
				Insert: {
					created_at?: string | null
					folder_id?: number | null
					id?: number
					image_url?: string[] | null
					min_quantity?: number | null
					name: string
					note?: string | null
					price?: number | null
					quantity?: number | null
					tag?: string | null
					typeAmount?: string | null
					updated_at?: string | null
					user_id: string
				}
				Update: {
					created_at?: string | null
					folder_id?: number | null
					id?: number
					image_url?: string[] | null
					min_quantity?: number | null
					name?: string
					note?: string | null
					price?: number | null
					quantity?: number | null
					tag?: string | null
					typeAmount?: string | null
					updated_at?: string | null
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'items_folder_id_fkey'
						columns: ['folder_id']
						isOneToOne: false
						referencedRelation: 'folders'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'items_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
			transactions: {
				Row: {
					action: string
					amountchange: number | null
					changed_item: Json | null
					changes: string[] | null
					folder_id: number | null
					id: number
					isedited: boolean | null
					isreverted: boolean | null
					item_id: number | null
					prev_item: Json | null
					pricechange: number | null
					timestamp: string | null
					user_id: string
				}
				Insert: {
					action: string
					amountchange?: number | null
					changed_item?: Json | null
					changes?: string[] | null
					folder_id?: number | null
					id?: number
					isedited?: boolean | null
					isreverted?: boolean | null
					item_id?: number | null
					prev_item?: Json | null
					pricechange?: number | null
					timestamp?: string | null
					user_id: string
				}
				Update: {
					action?: string
					amountchange?: number | null
					changed_item?: Json | null
					changes?: string[] | null
					folder_id?: number | null
					id?: number
					isedited?: boolean | null
					isreverted?: boolean | null
					item_id?: number | null
					prev_item?: Json | null
					pricechange?: number | null
					timestamp?: string | null
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'transactions_folder_id_fkey'
						columns: ['folder_id']
						isOneToOne: false
						referencedRelation: 'folders'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'transactions_item_id_fkey'
						columns: ['item_id']
						isOneToOne: false
						referencedRelation: 'items'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'transactions_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
			users: {
				Row: {
					avatar_url: string | null
					email: string | null
					full_name: string | null
					id: string
					username: string | null
				}
				Insert: {
					avatar_url?: string | null
					email?: string | null
					full_name?: string | null
					id: string
					username?: string | null
				}
				Update: {
					avatar_url?: string | null
					email?: string | null
					full_name?: string | null
					id?: string
					username?: string | null
				}
				Relationships: []
			}
			warehouse_users: {
				Row: {
					added_at: string | null
					folder_id: number | null
					id: number
					permissions: string[]
					roles: Json | null
					user_id: string
				}
				Insert: {
					added_at?: string | null
					folder_id?: number | null
					id?: number
					permissions: string[]
					roles?: Json | null
					user_id: string
				}
				Update: {
					added_at?: string | null
					folder_id?: number | null
					id?: number
					permissions?: string[]
					roles?: Json | null
					user_id?: string
				}
				Relationships: [
					{
						foreignKeyName: 'warehouse_users_folder_id_fkey'
						columns: ['folder_id']
						isOneToOne: false
						referencedRelation: 'folders'
						referencedColumns: ['id']
					},
					{
						foreignKeyName: 'warehouse_users_user_id_fkey'
						columns: ['user_id']
						isOneToOne: false
						referencedRelation: 'users'
						referencedColumns: ['id']
					}
				]
			}
		}
		Views: {
			[_ in never]: never
		}
		Functions: {
			requesting_user_id: {
				Args: Record<PropertyKey, never>
				Returns: string
			}
		}
		Enums: {
			member_roles: 'isView'
		}
		CompositeTypes: {
			[_ in never]: never
		}
	}
}

type DefaultSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
				Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? (Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
			Database[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
			Row: infer R
	  }
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
			DefaultSchema['Views'])
	? (DefaultSchema['Tables'] &
			DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
			Row: infer R
	  }
		? R
		: never
	: never

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Insert: infer I
	  }
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
	? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
			Insert: infer I
	  }
		? I
		: never
	: never

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema['Tables']
		| { schema: keyof Database },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaTableNameOrOptions['schema']]['Tables']
		: never = never
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
			Update: infer U
	  }
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
	? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
			Update: infer U
	  }
		? U
		: never
	: never

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema['Enums']
		| { schema: keyof Database },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
		: never = never
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
	? Database[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
	? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
	: never

export type CompositeTypes<
	PublicCompositeTypeNameOrOptions extends
		| keyof DefaultSchema['CompositeTypes']
		| { schema: keyof Database },
	CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
		schema: keyof Database
	}
		? keyof Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
		: never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
	? Database[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
	: PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
	? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
	: never

export const Constants = {
	public: {
		Enums: {
			member_roles: ['isView'],
		},
	},
} as const
