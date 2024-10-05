import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import { createContext, PropsWithChildren, useContext, useRef, useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

type ModalType = {
  bottomSheetRef: React.RefObject<BottomSheetModal> | null,
  isModalCreateDebtOpen: boolean,
  setIsModalCreateDebtOpen: (value: boolean) => void
  handleOpen: () => void
  handleClose: () => void
}
const ModalContext = createContext<ModalType>({
  bottomSheetRef: null,
  isModalCreateDebtOpen: false,
  setIsModalCreateDebtOpen: () => {},
  handleOpen: () => {},
  handleClose: () => {},
})
export default function ModalProvider({ children }: PropsWithChildren) {
	const bottomSheetRef = useRef<BottomSheetModal>(null)
  const [isModalCreateDebtOpen, setIsModalCreateDebtOpen] = useState(false)

  const handleOpen = () => {
    console.log(bottomSheetRef.current);
    return bottomSheetRef.current?.present()
  }
  const handleClose = () => {
    return bottomSheetRef.current?.close()
  }
	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<ModalContext.Provider value={{bottomSheetRef, isModalCreateDebtOpen, setIsModalCreateDebtOpen, handleOpen, handleClose}}>{children}</ModalContext.Provider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	)
}

export const useModal = () => useContext(ModalContext)
