import React, { useRef, useState, useEffect } from 'react'
import {
	View,
	TextInput,
	NativeSyntheticEvent,
	TextInputKeyPressEventData,
} from 'react-native'

export default function VerificationCodeInput({
	onChange,
}: {
	onChange: (code: string) => void
}) {
	const [code, setCode] = useState<string[]>(Array(6).fill(''))
	const inputs = useRef<Array<TextInput | null>>([])

	const focusInput = (index: number) => {
		if (inputs.current[index]) {
			inputs.current[index]?.focus()
		}
	}

	const handleChange = (text: string, index: number) => {
		const newCode = [...code]

		if (text.length === 6) {
			const chars = text.split('').slice(0, 6)
			setCode(chars)
			onChange(chars.join(''))
			inputs.current[5]?.blur()
			return
		}

		newCode[index] = text
		setCode(newCode)

		if (text && index < 5) {
			focusInput(index + 1)
		}
	}

	const handleKeyPress = (
		e: NativeSyntheticEvent<TextInputKeyPressEventData>,
		index: number
	) => {
		if (e.nativeEvent.key === 'Backspace' && code[index] === '') {
			if (index > 0) {
				focusInput(index - 1)
			}
		}
	}

	useEffect(() => {
		onChange(code.join(''))
	}, [code])

	return (
		<View className='flex-row justify-center items-center mt-5'>
			{code.map((value, index) => (
				<TextInput
					key={index}
					ref={ref => (inputs.current[index] = ref)}
					value={value}
					onChangeText={text => handleChange(text, index)}
					onKeyPress={e => handleKeyPress(e, index)}
					keyboardType='number-pad'
					maxLength={6}
					style={{
						textAlign: 'center',
						fontSize: 24,
						color: 'white',
					}}
					className='w-12 h-12 border border-gray rounded-md bg-gray-800 mx-2 font-lexend_semibold'
				/>
			))}
		</View>
	)
}
