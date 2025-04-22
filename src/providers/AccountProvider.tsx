import { createContext, PropsWithChildren, useContext, useState } from 'react'
import {
	accountType,
	currencyType,
	folderType,
	infoTransactionType,
	itemType,
	transactionType,
} from '../types/types'

type AccountType = {
	isAuthenticated: boolean
	account: accountType
	folders: folderType[]
	items: itemType[]
	transactions: transactionType[]
	transactionSettings: {
		sortBy: string
		isAsc: boolean
		membersId: number[]
		itemsId: number[]
		actions: {
			isCreated: boolean
			isEdited: boolean
			isDeleted: boolean
			isReverted: boolean
		}
	}

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
			lowStockOnly: boolean
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
			lowStockOnly: boolean
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
		isReverted,
	}: {
		id: number
		name: string
		typeAmount: string
		image_url: string[]
		price: number
		quantity: number
		note: string
		tag: string
		isReverted?: boolean
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
	handleAddTransaction: ({
		folder_id,
		prev_item,
		changed_item,
	}: {
		folder_id: number
		prev_item: itemType
		changed_item: itemType
	}) => void
	getChangesByField: (
		folder_id: number,
		field: 'price' | 'amount',
		timeRange: 'today' | '1_week' | '2_weeks' | '1_month' | 'all' | 'custom',
		startDate: Date | null,
		endDate: Date | null
	) => { date: string; value: number }[]
	// getUserFullName: ({
	// 	user_id,
	// 	activeIndex,
	// }: {
	// 	user_id: number
	// 	activeIndex: number
	// }) => string
	getAction: (info: infoTransactionType) => string
	handleUpdateTransactionSettings: ({
		sortBy,
		isAsc,
		membersId,
		itemsId,
		actions,
	}: {
		sortBy: string
		isAsc: boolean
		membersId: number[]
		itemsId: number[]
		actions: {
			isCreated: boolean
			isEdited: boolean
			isDeleted: boolean
			isReverted: boolean
		}
	}) => void
	handleFilterAddMemberId: (id: number) => void
	deleteFilterMemberId: (id: number) => void
	addFilterItemId: (id: number) => void
	deleteFilterItemId: (id: number) => void
	setFolders: (folders: folderType[]) => void
	setTransactions: (transactions: transactionType[]) => void
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
      isManager: false
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
      lowStockOnly: false,
		},
	},
	transactions: [],
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
	handleAddTransaction: () => {},
	getChangesByField: () => [],
	// getUserFullName: () => '',
	getAction: () => '',
	transactionSettings: {
		sortBy: 'last updated',
		isAsc: true,
		membersId: [],
		itemsId: [],
		actions: {
			isCreated: true,
			isEdited: true,
			isDeleted: true,
			isReverted: true,
		},
	},
	handleUpdateTransactionSettings: () => {},
	handleFilterAddMemberId: () => {},
	deleteFilterMemberId: () => {},
	addFilterItemId: () => {},
	deleteFilterItemId: () => {},
	setFolders: () => {},
	setTransactions: () => {},
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
      isManager: false,
		},
	})

	const [folders, setFolders] = useState<folderType[]>([
		// {
		// 	created_at: '2024-10-16T17:53:39.031257Z',
		// 	lastUpdated: '2024-10-16T17:53:39.031257Z',
		// 	currency: {
		// 		name: 'USD',
		// 		value: '$',
		// 		countries: ['United States', 'Ecuador', 'El Salvador', 'Zimbabwe'],
		// 	},
		// 	id: 0,
		// 	name: 'Warehouse1',
		// 	options: [],
		// 	type: 'Simple',
		// 	members: [
		// 		{
		// 			id: 1,
		// 			email: account.email,
		// 			fullName: `${account.first_name}`,
		// 			roles: {
		// 				isView: true,
		// 				isAddItem: true,
		// 				isDeleteItem: true,
		// 				isEdit: true,
		// 				isCanInvite: true,
		// 				isAdmin: true,
		// 			},
		// 		},
		// 	],
		// 	totalPrice: 1,
		// 	totalQuantity: 3,
		// 	totalMembers: 1,
		// },
	])

	const [items, setItems] = useState<itemType[]>([
		// {
		// 	created_at: '2024-10-16T17:53:39.031257Z',
		// 	folder_id: 0,
		// 	id: 0,
		// 	image_url: [],
		// 	name: 'Item1',
		// 	note: '',
		// 	price: 1,
		// 	tag: 'test',
		// 	typeAmount: 'quantity',
		// 	amount: 3,
		// 	user_id: '1',
		// },
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
			lowStockOnly: boolean
		}
	}>({
		sortBy: 'name',
		isAsc: false,
		viewOptions: {
			name: true,
			image: true,
			quantity: true,
			price: true,
			totalPrice: true,
			lowStockOnly: false,
		},
	})

	const [transactionSettings, setTransactionSettings] = useState<{
		sortBy: string
		isAsc: boolean
		membersId: number[]
		itemsId: number[]
		actions: {
			isCreated: boolean
			isEdited: boolean
			isDeleted: boolean
			isReverted: boolean
		}
	}>({
		sortBy: 'last updated',
		isAsc: false,
		membersId: [],
		itemsId: [],
		actions: {
			isCreated: true,
			isEdited: true,
			isDeleted: true,
			isReverted: true,
		},
	})

	const [transactions, setTransactions] = useState<transactionType[]>([
		// {
		// 	folder_id: 0,
		// 	info: [
		// 		{
		// 			id: 0,
		// 			user_id: 1,
		// 			item_id: 0,
		// 			prev_item: {
		// 				id: 0,
		// 				name: 'Item1',
		// 				image_url: [],
		// 				note: '',
		// 				tag: 'test',
		// 				typeAmount: 'quantity',
		// 				amount: 3,
		// 				price: 1,
		// 			},
		// 			changed_item: {
		// 				id: 0,
		// 				name: 'Item1',
		// 				image_url: [],
		// 				note: '',
		// 				tag: 'test',
		// 				typeAmount: 'quantity',
		// 				amount: 4,
		// 				price: 2,
		// 			},
		// 			changes: ['amount', 'price'],
		// 			isCreated: true,
		// 			date: '2024-10-16T17:53:39.031257Z',
		// 		},
		// 	],
		// 	amount_changes: [],
		// 	price_changes: [],
		// },
	])

	const handleChangesInTransactions = ({
		prev_item,
		changed_item,
	}: {
		prev_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>
		changed_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>
	}) => {
		const changes: (keyof Omit<
			itemType,
			'created_at' | 'folder_id' | 'user_id'
		>)[] = []

		if (prev_item.name !== changed_item.name) changes.push('name')
		if (prev_item.image_url !== changed_item.image_url)
			changes.push('image_url')
		if (prev_item.note !== changed_item.note) changes.push('note')
		if (prev_item.tag !== changed_item.tag) changes.push('tag')
		if (prev_item.typeAmount !== changed_item.typeAmount)
			changes.push('typeAmount')
		if (prev_item.price !== changed_item.price) changes.push('price')
		if (prev_item.amount !== changed_item.amount) changes.push('amount')

		return changes
	}
	const handleAddTransaction = ({
		folder_id,
		prev_item,
		changed_item,
		isCreated = false,
		isEdited = false,
		isDeleted = false,
		isReverted = false,
	}: {
		folder_id: number
		prev_item: any
		changed_item: any
		isCreated?: boolean
		isEdited?: boolean
		isDeleted?: boolean
		isReverted?: boolean
	}) => {
		const newTransaction = {
			id: Date.now(),
			user_id: 1,
			item_id: prev_item.id,
			prev_item,
			changed_item,
			changes: handleChangesInTransactions({ prev_item, changed_item }),
			date: new Date().toISOString(),
			isCreated,
			isEdited,
			isDeleted,
			isReverted,
		}

		setTransactions(prevTransactions => {
			const folderIndex = prevTransactions.findIndex(
				transaction => transaction.folder_id === folder_id
			)

			const amountChange = (changed_item.amount || 0) - (prev_item.amount || 0)
			const priceChange = (changed_item.price || 0) - (prev_item.price || 0)

			if (folderIndex !== -1) {
				const updatedTransactions = [...prevTransactions]
				const folder = updatedTransactions[folderIndex]

				const lastAmount =
					folder.amount_changes.length > 0
						? folder.amount_changes[folder.amount_changes.length - 1].value
						: 0

				folder.amount_changes.push({
					date: new Date().toISOString(),
					value: lastAmount + amountChange,
				})

				const lastPrice =
					folder.price_changes.length > 0
						? folder.price_changes[folder.price_changes.length - 1].value
						: 0

				folder.price_changes.push({
					date: new Date().toISOString(),
					value: lastPrice + priceChange,
				})

				folder.info.push(newTransaction)
				return updatedTransactions
			} else {
				return [
					...prevTransactions,
					{
						folder_id,
						info: [newTransaction],
						amount_changes: [
							{
								date: new Date().toISOString(),
								value: changed_item.amount || 0,
							},
						],
						price_changes: [
							{
								date: new Date().toISOString(),
								value: changed_item.price || 0,
							},
						],
					},
				]
			}
		})
	}
	const getChangesByField = (
		folder_id: number,
		field: 'price' | 'amount',
		timeRange: 'today' | '1_week' | '2_weeks' | '1_month' | 'all' | 'custom',
		startDate: Date | null,
		endDate: Date | null
	) => {
		const folderTransactions = transactions.find(
			transaction => transaction.folder_id === folder_id
		)

		if (!folderTransactions) return []

		const now = new Date()

		const getStartDate = (range: string) => {
			const startDate = new Date(now)
			switch (range) {
				case 'today':
					startDate.setHours(0, 0, 0, 0)
					break
				case '1_week':
					startDate.setDate(now.getDate() - 7)
					break
				case '2_weeks':
					startDate.setDate(now.getDate() - 14)
					break
				case '1_month':
					startDate.setMonth(now.getMonth() - 1)
					break
				case 'all':
				default:
					return null
			}
			return startDate
		}

		let finalStartDate =
			timeRange === 'custom' ? startDate : getStartDate(timeRange)
		let finalEndDate = timeRange === 'custom' ? endDate ?? now : now

		const changes =
			field === 'amount'
				? folderTransactions.amount_changes
				: folderTransactions.price_changes

		return changes.filter(change => {
			const changeDate = new Date(change.date)
			if (finalStartDate && finalEndDate) {
				return changeDate >= finalStartDate && changeDate <= finalEndDate
			}
			return true
		})
	}

	const handleUpdateViewSettings = (data: {
		sortBy: string
		isAsc: boolean
		viewOptions: {
			name: boolean
			image: boolean
			quantity: boolean
			price: boolean
			totalPrice: boolean
			lowStockOnly: boolean
		}
	}) => {
		setSettings(data)
	}

	const handleUpdateTransactionSettings = (data: {
		sortBy: string
		isAsc: boolean
		membersId: number[]
		itemsId: number[]
		actions: {
			isCreated: boolean
			isEdited: boolean
			isDeleted: boolean
			isReverted: boolean
		}
	}) => {
		setTransactionSettings(data)
	}

	const handleFilterAddMemberId = (id: number) => {
		setTransactionSettings(prevSettings => ({
			...prevSettings,
			membersId: [...prevSettings.membersId, id],
		}))
	}

	const deleteFilterMemberId = (id: number) => {
		setTransactionSettings(prevSettings => ({
			...prevSettings,
			membersId: prevSettings.membersId.filter(memberId => memberId !== id),
		}))
	}

	const addFilterItemId = (id: number) => {
		setTransactionSettings(prevSettings => ({
			...prevSettings,
			itemsId: [...prevSettings.itemsId, id],
		}))
	}

	const deleteFilterItemId = (id: number) => {
		setTransactionSettings(prevSettings => ({
			...prevSettings,
			itemsId: prevSettings.itemsId.filter(itemId => itemId !== id),
		}))
	}

	const handleSignUp = (data: {
		email?: string
		first_name?: string
		last_name?: string
	}) => {
		setAccount({ ...account, ...data })
	}
	const switchIsAuthenticated = () => setIsAuthenticated(true)
	const handleLogout = () => setIsAuthenticated(false)

	const handleRecalculateFolder = (updatedItems?: itemType[]) => {
		const itemsToUse = updatedItems || items
		setFolders(prevFolders =>
			prevFolders.map(folder => {
				return {
					...folder,
					lastUpdated: new Date().toISOString(),
					totalPrice: parseFloat(
						itemsToUse
							.filter(item => item.folder_id === folder.id)
							.reduce((acc, item) => acc + item.price * item.amount, 0)
							.toFixed(2)
					),
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
		return isAuthenticated
	}
	const handleTest = () => {}

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
		// console.log(currency)
		setFolders((prevFolders:any) => {
			const newFolder = {
				created_at: new Date().toISOString(),
				lastUpdated: new Date().toISOString(),
				currency,
				type,
				name,
				options,
				id: prevFolders.length + 1,
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
			}

			setTransactions(prevTransactions => [
				...prevTransactions,
				{
					folder_id: newFolder.id,
					info: [],
					amount_changes: [],
					price_changes: [],
				},
			])

			return [...prevFolders, newFolder]
		})
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
				folder.id === id
					? {
							...folder,
							name,
							currency,
							type,
							options,
							lastUpdated: new Date().toISOString(),
					  }
					: folder
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
		setItems((prevItems:any) => {
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
			}

			handleAddTransaction({
				folder_id: data.folder_id,
				prev_item: { ...newItem, amount: 0, price: 0 },
				changed_item: newItem,
				isCreated: true,
			})

			const updatedItems = [...prevItems, newItem]
			handleRecalculateFolder(updatedItems)
			return updatedItems
		})
	}

	const handleChangeQuantity = ({
		quantity,
		item_id,
	}: {
		quantity: number
		item_id: number
	}) => {
		if (quantity < 0) return
		console.log('change quantity' + quantity, item_id)
		setItems(
			items.map(item =>
				item.id === item_id ? { ...item, quantity } : { ...item }
			)
		)
		setFolders(
			folders.map(folder =>
				folder.id === item_id
					? {
							...folder,
							totalQuantity: folder.totalQuantity + quantity,
							lastUpdated: new Date().toISOString(),
					  }
					: { ...folder, lastUpdated: new Date().toISOString() }
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
		setFolders((prevFolders:any) => {
			const folderExists = prevFolders.some((folder:any) => folder.id === folderId)
			if (!folderExists) {
				console.error(`Folder with ID ${folderId} not found.`)
				return prevFolders
			}

			return prevFolders.map((folder:any) =>
				folder.id === folderId
					? {
							...folder,
							lastUpdated: new Date().toISOString(),
							totalMembers: folder.totalMembers + 1,
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
		isReverted = false,
	}: {
		id: number
		name: string
		typeAmount: string
		image_url: string[]
		price: number
		quantity: number
		note: string
		tag: string
		isReverted?: boolean
	}) => {
		setItems(prevItems => {
			const updatedItems = prevItems.map(item => {
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
					}

					if (isReverted) {
						handleAddTransaction({
							folder_id: item.folder_id!,
							prev_item: item,
							changed_item: updatedItem,
							isReverted: true,
						})
					} else {
						handleAddTransaction({
							folder_id: item.folder_id!,
							prev_item: item,
							changed_item: updatedItem,
							isEdited: true,
						})
					}

					return updatedItem
				}
				return item
			})

			handleRecalculateFolder(updatedItems)
			return updatedItems
		})
	}
	const handleDeleteItem = ({ id }: { id: number }) => {
		setItems(prevItems => {
			const itemToDelete = prevItems.find(item => item.id === id)
			const updatedItems = prevItems.filter(item => item.id !== id)

			if (itemToDelete) {
				handleAddTransaction({
					folder_id: itemToDelete.folder_id!,
					prev_item: itemToDelete,
					changed_item: { ...itemToDelete, amount: 0 },
					isDeleted: true,
				})
			}

			handleRecalculateFolder(updatedItems)
			return updatedItems
		})
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
		setFolders((prevFolders:any) => {
			const folderExists = prevFolders.some((folder:any) => folder.id === folderId)
			if (!folderExists) {
				console.error(`Folder with ID ${folderId} not found.`)
				return prevFolders
			}

			return prevFolders.map((folder:any) =>
				folder.id === folderId
					? {
							...folder,
							lastUpdated: new Date().toISOString(),
							members: folder.members.map((member:any) =>
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
							lastUpdated: new Date().toISOString(),
							totalMembers: folder.totalMembers - 1,
							members: folder.members.filter(member => member.id !== id),
					  }
					: folder
			)
		})
	}

	// const getUserFullName = ({
	// 	user_id,
	// 	activeIndex,
	// }: {
	// 	user_id: number
	// 	activeIndex: number
	// }) => {
	// 	const fullName =
	// 		folders
	// 			.find(folder => folder.id === activeIndex)
	// 			?.members.find(member => member.id === user_id)?.fullName || ''

	// 	return fullName
	// }

	const getAction = (info: infoTransactionType) => {
		// console.log(info);
		if (info.isCreated) return 'created item ' + info.changed_item.name
		// if (!info.isCreated) return 'edited item ' + info.changed_item.name

		if (info.isEdited) return 'edited item ' + info.changed_item.name
		if (info.isDeleted) return 'deleted item ' + info.prev_item.name
		if (info.isReverted) return 'reverted item ' + info.prev_item.name

		return 'smth went wrong'
	}

	console.log('rerender')

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
				transactions,
				handleAddTransaction,
				getChangesByField,
				// getUserFullName,
				getAction,
				transactionSettings,
				handleUpdateTransactionSettings,
				handleFilterAddMemberId,
				deleteFilterMemberId,
				addFilterItemId,
				deleteFilterItemId,
				setFolders,
				setTransactions,
			}}
		>
			{children}
		</AccountContext.Provider>
	)
}
export const useAccount = () => useContext(AccountContext)
