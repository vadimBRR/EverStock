import React, { useRef, useState } from 'react';
import { View, TextInput, Text } from 'react-native';

export default function VerificationCodeInput() {
  const [code, setCode] = useState(['', '', '', '',[]]); 
  const inputs = useRef<Array<TextInput | null>>([]); 

  const handleChange = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;

    setCode(newCode);

    if (text && index < inputs.current.length - 1) {
      inputs.current[index + 1]?.focus();
    }

    if (!text && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && code[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-center mt-5">
      {code.map((value, index) => (
        <TextInput
          key={index}
          ref={ref => (inputs.current[index] = ref)}
          value={typeof value === 'string' ? value : ''}
          onChangeText={text => handleChange(text, index)}
          onKeyPress={e => handleKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          style={{
            textAlign: 'center',
            fontSize: 24,
            color: 'white',
          }}
          className="w-12 h-12 border border-gray rounded-md bg-gray-800 mx-2"
        />
      ))}
    </View>
  );
}
