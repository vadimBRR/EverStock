
export type currencyType = {
  name: string;
  value: string;
  countries: string[]
}

export type folderType = {
  created_at: string;
  currency: currencyType;
  id: number;
  name: string;
  options: string[];
  type: string;
  members: {
    id: number;
    email: string;
    fullName: string;
    roles: {
      isView:boolean,
      isAddItem:boolean,
      isDeleteItem:boolean,
      isEdit:boolean,
      isCanInvite:boolean,
      isAdmin:boolean
    }
  }[]
  totalPrice: number;
  totalQuantity: number;
  totalMembers: number
}

export type itemType = {
  created_at: string;
  folder_id: number;
  id: number;
  image_url: string[];
  name: string;
  note: string;
  price: number;
  typeAmount: string;
  amount: number;
  user_id: string;
  tag: string
}

export type accountType = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;  
  roles: {
    isView:boolean,
    isAddItem:boolean,
    isDeleteItem:boolean,
    isEdit:boolean,
    isCanInvite:boolean,
    isAdmin:boolean
  }
}