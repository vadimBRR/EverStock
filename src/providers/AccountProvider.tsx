import { createContext, PropsWithChildren, useContext, useState } from 'react'
import {
	accountType,
	currencyType,
	folderType,
	itemType,
	transactionType,
} from '../types/types'
import { currency } from '../constants'

type AccountType = {
	isAuthenticated: boolean
	account: accountType
	folders: folderType[]
	items: itemType[]
	handleSignUp: ({
		email,
		first_name,
		last_name,
	}: {
		email?: string
		first_name?: string
		last_name?: string
	}) => void
	viewSettings: {
		sortBy: string
		isAsc: boolean
		viewOptions: {
			name: boolean
			image: boolean
			quantity: boolean
			price: boolean
			totalPrice: boolean
		}
	}
	handleUpdateViewSettings: (data: {
		sortBy: string
		isAsc: boolean
		viewOptions: {
			name: boolean
			image: boolean
			quantity: boolean
			price: boolean
			totalPrice: boolean
		}
	}) => void
	handleSignIn: ({ email }: { email: string }) => void
	handleLogout: () => void
	handleIsAuthenticated: () => void
	handleTest: () => void
	handleCreateFolder: ({
		name,
		currency,
		type,
		options,
	}: {
		name: string
		currency: currencyType
		type: string
		options: string[]
	}) => void
	handleUpdateFolder: ({
		id,
		name,
		currency,
		type,
		options,
	}: {
		id: number
		name: string
		currency: currencyType
		type: string
		options: string[]
	}) => void
	switchIsAuthenticated: () => void
	handleCreateItem: (data: {
		name: string
		folder_id: number
		image_url: string[]
		price?: number
		quantity?: number
		typeAmount?: string
		note?: string
		tag?: string
	}) => void
	handleChangeQuantity: ({
		quantity,
		item_id,
	}: {
		quantity: number
		item_id: number
	}) => void

	handleChangeImages: ({
		images,
		item_id,
	}: {
		images: string[]
		item_id: number
	}) => void
	handleUpdateItem: ({
		id,
		name,
		image_url,
		price,
		quantity,
		typeAmount,
		note,
		tag,
	}: {
		id: number
		name: string
		typeAmount: string
		image_url: string[]
		price: number
		quantity: number
		note: string
		tag: string
	}) => void
	handleDeleteItem: ({ id }: { id: number }) => void
	handleCloneItem: ({ item_id }: { item_id: number }) => void
	handleChangeItemFolder: ({
		item_id,
		folder_id,
	}: {
		item_id: number
		folder_id: number
	}) => void
	handleAddMember: ({
		folderId,
		email,
		role,
	}: {
		folderId: number
		email: string
		role: {
			isView: boolean
			isAddItem: boolean
			isDeleteItem: boolean
			isEdit: boolean
			isCanInvite: boolean
			isAdmin: boolean
		}
	}) => void
	handleUpdateMember: ({
		id,
		folderId,
		email,
		roles,
	}: {
		id: number
		folderId: number
		email: string
		roles: {
			isView: boolean
			isAddItem: boolean
			isDeleteItem: boolean
			isEdit: boolean
			isCanInvite: boolean
			isAdmin: boolean
		}
	}) => void

	handleDeleteMember: ({
		id,
		folderId,
	}: {
		id: number
		folderId: number
	}) => void
}

const AccountContext = createContext<AccountType>({
	isAuthenticated: false,
	account: {
		id: 1,
		email: '',
		first_name: '',
		last_name: '',
		roles: {
			isView: false,
			isAddItem: false,
			isDeleteItem: false,
			isEdit: false,
			isCanInvite: false,
			isAdmin: true,
		},
	},
	folders: [],
	items: [],
	viewSettings: {
		sortBy: 'name',
		isAsc: true,
		viewOptions: {
			name: true,
			image: true,
			quantity: true,
			price: true,
			totalPrice: true,
		},
	},
	handleSignUp: () => {},
	handleSignIn: () => {},
	handleLogout: () => {},
	handleIsAuthenticated: () => {},
	handleTest: () => {},
	handleCreateFolder: () => {},
	handleUpdateFolder: () => {},
	switchIsAuthenticated: () => {},
	handleCreateItem: () => {},
	handleChangeQuantity: () => {},
	handleChangeImages: () => {},
	handleUpdateItem: () => {},
	handleDeleteItem: () => {},
	handleCloneItem: () => {},
	handleChangeItemFolder: () => {},
	handleAddMember: () => {},
	handleUpdateMember: () => {},
	handleDeleteMember: () => {},
	handleUpdateViewSettings: () => {},
})

export default function AccountProvider({ children }: PropsWithChildren) {
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [account, setAccount] = useState<accountType>({
		id: 1,
		email: 'admin@gmail.com',
		first_name: 'Admin Admin',
		last_name: '',
		roles: {
			isView: false,
			isAddItem: false,
			isDeleteItem: false,
			isEdit: false,
			isCanInvite: false,
			isAdmin: true,
		},
	})

	const [folders, setFolders] = useState<folderType[]>([
		{
			created_at: '2024-10-16T17:53:39.031257Z',
			currency: {
				name: 'USD',
				value: '$',
				countries: ['United States', 'Ecuador', 'El Salvador', 'Zimbabwe'],
			},
			id: 0,
			name: 'Warehouse1',
			options: [],
			type: 'Simple',
			members: [
				{
					id: 1,
					email: account.email,
					fullName: `${account.first_name}`,
					roles: {
						isView: true,
						isAddItem: true,
						isDeleteItem: true,
						isEdit: true,
						isCanInvite: true,
						isAdmin: true,
					},
				},
			],
			totalPrice: 1,
			totalQuantity: 3,
			totalMembers: 1,
		},
	])

	const [items, setItems] = useState<itemType[]>([
		{
			created_at: '2024-10-16T17:53:39.031257Z',
			folder_id: 0,
			id: 0,
			image_url: [],
			name: 'Item1',
			note: '',
			price: 1,
			tag: 'test',
			typeAmount: 'quantity',
			amount: 3,
			user_id: '1',
		},
	])

	const [viewSettings, setSettings] = useState<{
		sortBy: string
		isAsc: boolean
		viewOptions: {
			name: boolean
			image: boolean
			quantity: boolean
			price: boolean
			totalPrice: boolean
		}
	}>({
		sortBy: 'name',
		isAsc: false,
		viewOptions: {
			name: true,
			image: true,
			quantity: false,
			price: false,
			totalPrice: false,
		},
	})

	const [transactions, setTransactions] = useState<transactionType[]>([
		{
			folder_id: 0,
			info: [{
        id: 0,
				user_id: 1,
				item_id: 0,
				prev_item: {
					id: 0,
					name: 'Item1',
					image_url: [],
					note: '',
					tag: 'test',
					typeAmount: 'quantity',
					amount: 3,
					price: 1,
				},
				changed_item: {
					id: 0,
					name: 'Item1',
					image_url: [],
					note: '',
					tag: 'test',
					typeAmount: 'quantity',
					amount: 4,
					price: 1,
				},
				date: '2024-10-16T17:53:39.031257Z',
			}],
		},
	])

	const handleAddTransaction = ({
    folder_id,
    prev_item,
    changed_item,
  }: {
    folder_id: number;
    prev_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>;
    changed_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>;
  }) => {
    const newTransaction = {
      id: Date.now(), // Унікальний ідентифікатор транзакції
      user_id: 1, // Тут можна вставити ID користувача (можливо, отриманий із контексту або з іншого джерела)
      item_id: prev_item.id, // ID предмета
      prev_item,
      changed_item,
      date: new Date().toISOString(),
    };

    setTransactions((prevTransactions) => {
      const folderIndex = prevTransactions.findIndex(
        (transaction) => transaction.folder_id === folder_id
      );

      if (folderIndex !== -1) {
        // Якщо папка існує, додаємо нову транзакцію до цієї папки
        const updatedTransactions = [...prevTransactions];
        updatedTransactions[folderIndex].info.push(newTransaction);
        return updatedTransactions;
      } else {
        // Якщо папки немає, створюємо нову
        return [
          ...prevTransactions,
          {
            folder_id,
            info: [newTransaction],
          },
        ];
      }
    });
  };




	const handleUpdateViewSettings = (data: {
		sortBy: string
		isAsc: boolean
		viewOptions: {
			name: boolean
			image: boolean
			quantity: boolean
			price: boolean
			totalPrice: boolean
		}
	}) => {
		setSettings(data)
	}

	const handleSignUp = (data: {
		email?: string
		first_name?: string
		last_name?: string
	}) => {
		console.log('handle login -2')

		setAccount({ ...account, ...data })
		console.log('handle login -3')
	}
	const switchIsAuthenticated = () => setIsAuthenticated(true)
	const handleLogout = () => setIsAuthenticated(false)

	const handleRecalculateFolder = (updatedItems?: itemType[]) => {
		const itemsToUse = updatedItems || items
		setFolders(prevFolders =>
			prevFolders.map(folder => {
				return {
					...folder,
					totalPrice: itemsToUse
						.filter(item => item.folder_id === folder.id)
						.reduce((acc, item) => acc + item.price, 0),
					totalQuantity: itemsToUse
						.filter(item => item.folder_id === folder.id)
						.reduce((acc, item) => acc + item.amount, 0),
				}
			})
		)
	}

	const handleSignIn = ({ email }: { email: string }) => {
		setAccount({ ...account, email, first_name: 'Vadym', last_name: 'Brovych' })
		setIsAuthenticated(true)
	}

	const handleIsAuthenticated = () => {
		console.log('прозьба прийшла')
		return isAuthenticated
	}
	const handleTest = () => {
		console.log('test')
	}
	console.log('AccountProvider is rendering')

	const handleCreateFolder = ({
		name,
		currency,
		type,
		options,
	}: {
		name: string
		currency: currencyType
		type: string
		options: string[]
	}) => {
		setFolders([
			...folders,
			{
				created_at: new Date().toISOString(),
				currency: currency,
				type: type,
				name: name,
				options: options,
				id: folders.length + 1,
				members: [
					{
						id: 1,
						email: account.email,
						fullName: `${account.first_name}`,
						roles: {
							isView: false,
							isAddItem: false,
							isDeleteItem: false,
							isEdit: false,
							isCanInvite: false,
							isAdmin: true,
						},
					},
				],
				totalPrice: 0,
				totalQuantity: 0,
				totalMembers: 1,
			},
		])
	}

	const handleUpdateFolder = ({
		id,
		name,
		currency,
		type,
		options,
	}: {
		id: number
		name: string
		currency: currencyType
		type: string
		options: string[]
	}) => {
		setFolders(
			folders.map(folder =>
				folder.id === id ? { ...folder, name, currency, type, options } : folder
			)
		)
	}

	const handleCreateItem = (data: {
		name: string
		folder_id: number
		image_url: string[]
		price?: number
		typeAmount?: string
		quantity?: number
		note?: string
		tag?: string
	}) => {
		setItems((prevItems) => {
      const newItem = {
        name: data.name,
        folder_id: data.folder_id,
        image_url: data.image_url,
        price: data.price || 0,
        typeAmount: data.typeAmount || 'quantity',
        amount: data.quantity || 0,
        note: data.note || '',
        tag: data.tag || '',
        created_at: new Date().toISOString(),
        id: prevItems.length + 1,
        user_id: '1',
      };

      handleAddTransaction({
        folder_id: data.folder_id,
        prev_item: { ...newItem, amount: 0 }, // Перед додаванням
        changed_item: newItem, // Після додавання
      });

      const updatedItems = [...prevItems, newItem];
      handleRecalculateFolder(updatedItems);
      return updatedItems;
    });
	}

	const handleChangeQuantity = ({
		quantity,
		item_id,
	}: {
		quantity: number
		item_id: number
	}) => {
		if (quantity < 0) return
		setItems(
			items.map(item =>
				item.id === item_id ? { ...item, quantity } : { ...item }
			)
		)
		setFolders(
			folders.map(folder =>
				folder.id === item_id
					? { ...folder, totalQuantity: folder.totalQuantity + quantity }
					: { ...folder }
			)
		)
		handleRecalculateFolder()
	}

	const handleChangeImages = ({
		images,
		item_id,
	}: {
		images: string[]
		item_id: number
	}) => {
		console.log('changed photos')
		setItems(
			items.map(item =>
				item.id === item_id ? { ...item, image_url: images } : { ...item }
			)
		)
	}

	const handleAddMember = ({
		folderId,
		email,
		role,
	}: {
		folderId: number
		email: string
		role: {
			isView: boolean
			isAddItem: boolean
			isDeleteItem: boolean
			isEdit: boolean
			isCanInvite: boolean
			isAdmin: boolean
		}
	}) => {
		setFolders(prevFolders => {
			const folderExists = prevFolders.some(folder => folder.id === folderId)
			if (!folderExists) {
				console.error(`Folder with ID ${folderId} not found.`)
				return prevFolders
			}

			return prevFolders.map(folder =>
				folder.id === folderId
					? {
							...folder,
							members: [
								...(folder.members || []),
								{
									id: (folder.members?.length || 0) + 1,
									email: email,
									roles: role,
									fullName: `Tester Tester${(folder.members?.length || 0) + 1}`,
								},
							],
					  }
					: folder
			)
		})
	}

	const handleUpdateItem = ({
		id,
		name,
		image_url,
		price,
		quantity,
		typeAmount,
		note,
		tag,
	}: {
		id: number
		name: string
		typeAmount: string
		image_url: string[]
		price: number
		quantity: number
		note: string
		tag: string
	}) => {
		setItems((prevItems) => {
      const updatedItems = prevItems.map((item) => {
        if (item.id === id) {
          const updatedItem = {
            ...item,
            name,
            typeAmount,
            image_url,
            price,
            amount: quantity,
            note,
            tag,
          };

          handleAddTransaction({
            folder_id: item.folder_id!,
            prev_item: item,
            changed_item: updatedItem,
          });

          return updatedItem;
        }
        return item;
      });

      handleRecalculateFolder(updatedItems);
      return updatedItems;
    });
	}
	const handleDeleteItem = ({ id }: { id: number }) => {
		setItems((prevItems) => {
      const itemToDelete = prevItems.find((item) => item.id === id);
      const updatedItems = prevItems.filter((item) => item.id !== id);

      if (itemToDelete) {
        handleAddTransaction({
          folder_id: itemToDelete.folder_id!,
          prev_item: itemToDelete,
          changed_item: { ...itemToDelete, amount: 0 },
        });
      }

      handleRecalculateFolder(updatedItems);
      return updatedItems;
    });
	}

	const handleChangeItemFolder = ({
		item_id,
		folder_id,
	}: {
		item_id: number
		folder_id: number
	}) => {
		setItems(prevItems => {
			const updatedItems = prevItems.map(item =>
				item.id === item_id ? { ...item, folder_id } : item
			)
			handleRecalculateFolder(updatedItems)
			return updatedItems
		})
	}

	const handleCloneItem = ({ item_id }: { item_id: number }) => {
		setItems(prevItems => {
			const item = prevItems.find(item => item.id === item_id)
			if (!item) return prevItems
			const updatedItems = [...prevItems, { ...item, id: prevItems.length + 1 }]
			handleRecalculateFolder(updatedItems)
			return updatedItems
		})
	}

	const handleUpdateMember = ({
		id,
		folderId,
		email,
		roles,
	}: {
		id: number
		folderId: number
		email: string
		roles: {
			isView: boolean
			isAddItem: boolean
			isDeleteItem: boolean
			isEdit: boolean
			isCanInvite: boolean
			isAdmin: boolean
		}
	}) => {
		setFolders(prevFolders => {
			const folderExists = prevFolders.some(folder => folder.id === folderId)
			if (!folderExists) {
				console.error(`Folder with ID ${folderId} not found.`)
				return prevFolders
			}

			return prevFolders.map(folder =>
				folder.id === folderId
					? {
							...folder,
							members: folder.members.map(member =>
								member.id === id ? { ...member, email, roles } : member
							),
					  }
					: folder
			)
		})
	}

	const handleDeleteMember = ({
		id,
		folderId,
	}: {
		id: number
		folderId: number
	}) => {
		setFolders(prevFolders => {
			const folderExists = prevFolders.some(folder => folder.id === folderId)
			if (!folderExists) {
				console.error(`Folder with ID ${folderId} not found.`)
				return prevFolders
			}

			return prevFolders.map(folder =>
				folder.id === folderId
					? {
							...folder,
							members: folder.members.filter(member => member.id !== id),
					  }
					: folder
			)
		})
	}

	return (
		<AccountContext.Provider
			value={{
				isAuthenticated,
				account,
				folders,
				items,
				handleSignUp,
				handleSignIn,
				handleLogout,
				handleIsAuthenticated,
				handleTest,
				handleCreateFolder,
				handleUpdateFolder,
				switchIsAuthenticated,
				handleCreateItem,
				handleChangeQuantity,
				handleChangeImages,
				handleUpdateItem,
				handleDeleteItem,
				handleCloneItem,
				handleChangeItemFolder,
				handleAddMember,
				handleUpdateMember,
				handleDeleteMember,
				handleUpdateViewSettings,
				viewSettings,
			}}
		>
			{children}
		</AccountContext.Provider>
	)
}
export const useAccount = () => useContext(AccountContext)
