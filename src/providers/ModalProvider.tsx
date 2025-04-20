import {
	BottomSheetModal,
	BottomSheetModalProvider,
} from '@gorhom/bottom-sheet'
import {
	createContext,
	PropsWithChildren,
	useContext,
	useRef,
	useState,
} from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

type ModalType = {
	modalCreateRef: React.RefObject<BottomSheetModal> | null
	modalAnotherRef: React.RefObject<BottomSheetModal> | null
  modalExportRef: React.RefObject<BottomSheetModal> | null
	isModalCreateDebtOpen: boolean
	setIsModalCreateDebtOpen: (value: boolean) => void
	handleOpenCreate: () => void
	handleCloseCreate: () => void
	handleOpenAnother: () => void
	handleCloseAnother: () => void
  handleOpenExport: () => void
  handleCloseExport: () => void
}

const ModalContext = createContext<ModalType>({
	modalCreateRef: null,
	modalAnotherRef: null,
  modalExportRef: null,
	isModalCreateDebtOpen: false,
	setIsModalCreateDebtOpen: () => {},
	handleOpenCreate: () => {},
	handleCloseCreate: () => {},
	handleOpenAnother: () => {},
	handleCloseAnother: () => {},
  handleOpenExport: () => {},
  handleCloseExport: () => {},
})

export default function ModalProvider({ children }: PropsWithChildren) {
	const modalCreateRef = useRef<BottomSheetModal>(null)
	const modalExportRef = useRef<BottomSheetModal>(null)
	const modalAnotherRef = useRef<BottomSheetModal>(null)
	const [isModalCreateDebtOpen, setIsModalCreateDebtOpen] = useState(false)

	const handleOpenCreate = () => {
		return modalCreateRef.current?.present()
	}

	const handleCloseCreate = () => {
		return modalCreateRef.current?.close()
	}
	const handleOpenExport = () => {
		return modalExportRef.current?.present()
	}

	const handleCloseExport = () => {
		return modalExportRef.current?.close()
	}

	const handleOpenAnother = () => {
		return modalAnotherRef.current?.present()
	}

	const handleCloseAnother = () => {
		return modalAnotherRef.current?.close()
	}

	return (
		<GestureHandlerRootView style={{ flex: 1 }}>
			<BottomSheetModalProvider>
				<ModalContext.Provider
					value={{
						modalCreateRef,
						modalAnotherRef,
            modalExportRef,
						isModalCreateDebtOpen,
						setIsModalCreateDebtOpen,
						handleOpenCreate,
						handleCloseCreate,
						handleOpenAnother,
						handleCloseAnother,
            handleOpenExport,
            handleCloseExport
					}}
				>
					{children}
				</ModalContext.Provider>
			</BottomSheetModalProvider>
		</GestureHandlerRootView>
	)
}

export const useModal = () => useContext(ModalContext)
