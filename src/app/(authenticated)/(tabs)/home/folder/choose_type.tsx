import { View, Text } from 'react-native'
import React, { useEffect, useMemo } from 'react'
import Container from '@/src/components/Container'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import CustomButton from '@/src/components/CustomButton'
import CustomCheckBox from '@/src/components/CustomCheckBox'
import { Ionicons } from '@expo/vector-icons'


export default function ChooseTypeScreen() {
	const router = useRouter()
  const params = useLocalSearchParams();
  const { type, options } = params

  console.log('params: ', params);
	const [folderType, setFolderType] = React.useState<'Simple' | 'Detailed'>(
		'Simple'
	)
	const [checkboxes, setCheckboxes] = React.useState<
		{ id: number; text: string; checked: boolean }[]
	>([
    { id: 1, text: 'Floor', checked: false },
    { id: 2, text: 'Zone', checked: false },
    { id: 3, text: 'Shelf', checked: false },
    { id: 4, text: 'Row', checked: false },
    { id: 5, text: 'Rack Number', checked: false },
  ])

	const data = [
		{ element: '3 images', simple: true, detailed: true },
		{ element: 'Name', simple: true, detailed: true },
		{ element: 'Price', simple: true, detailed: true },
		{ element: 'Quantity', simple: true, detailed: true },
		{ element: 'Description', simple: true, detailed: true },
		{ element: 'Position', simple: false, detailed: true },
	]

	const handleCheckboxChange = (id: number) => {
		setCheckboxes(prevCheckboxes => {
			return prevCheckboxes.map(checkbox => {
				if (checkbox.id === id) {
					return { ...checkbox, checked: !checkbox.checked }
				}
				return checkbox
			})
		})
	}

  const handleApply = () => {

    console.log("here");
    // console.log(JSON.stringify(checkboxes));
    router.back()
    router.setParams({ type: folderType, options: checkboxes.filter(checkbox => checkbox.checked).map(checkbox => checkbox.text)})
    // router.setParams({ folderType: folderType, options: JSON.stringify(checkboxes)})
  }

  useEffect(() => {
    if(type){
      console.log("type", type);
        const folderTypeFromParams: string  = typeof type === 'string' ? type : type[0]
        if(folderTypeFromParams !== folderType && folderTypeFromParams==='Simple' || folderTypeFromParams==='Detailed'){
          setFolderType(folderTypeFromParams);
        }
    }

    if(options){
      console.log("options", options);
      setCheckboxes(prevCheckboxes => {
        return prevCheckboxes.map(checkbox => {
          if(options.includes(checkbox.text)){
            return { ...checkbox, checked: true }
          }
          return checkbox;
        })
      })

        
    }
  }, [type, JSON.stringify(options)]);

	return (
		<Container isPadding={false}>
			<Stack.Screen
				options={{
					headerShown: true,
					title: 'Folder Type',
					headerTitleAlign: 'center',
          headerStyle: {
            backgroundColor: '#242121',         
          },
          headerTintColor: '#fff',
				}}
			/>
			<View className='mx-4 mt-2 flex-1 justify-between mb-5'>
				<View>
					<View className='rounded-2xl bg-black-600 border border-dark_gray overflow-hidden '>
						<View className='flex-row justify-around  py-2 '>
							<Text className='text-lg font-lexend_semibold text-white'>Element</Text>
							<Text className='text-lg font-lexend_semibold text-white'>Simple</Text>
							<Text className='text-lg font-lexend_semibold text-white'>Detailed</Text>
						</View>
						{data.map((item, index) => (
							<View
								key={item.element + index}
								className='flex-row justify-around py-2 px-4 border   border-dark_gray '
							>
								<Text className=' flex-1 font-lexend_regular text-base text-white'>
									{item.element}
								</Text>
								<Text className='flex-1 text-center font-lexend_regular text-white text-lg'>
									{item.simple ? <Ionicons name="checkmark" size={24} color="white" /> : ''}
								</Text>
								<Text className='flex-1 text-center font-lexend_regular  text-white text-lg'>
									{item.detailed ? <Ionicons name="checkmark" size={24} color="white" /> : ''}
								</Text>
							</View>
						))}
					</View>
					<View>
						<Text className='text-2xl font-lexend_light mt-4 text-white'>
							Choose Folder Type:
						</Text>

						<CustomButton
							text='Simple'
							styleContainer={` my-2 mx-0 `}
							isActive={folderType === 'Simple'}
							onClick={() => setFolderType('Simple')}
						/>
						<CustomButton
							text='Detailed'
							styleContainer={` mx-0 `}
							isActive={folderType === 'Detailed'}
							onClick={() => setFolderType('Detailed')}
						/>
					</View>
          {folderType === 'Detailed' && (
					<View className='flex-row flex-wrap mx-3 mt-4'>
						{checkboxes.map(checkbox => (
							<View
                key={checkbox.id}
								className={`${
									checkbox.id === checkboxes.length ? '' : 'w-1/3'
								}  mb-4`}
							>
								<CustomCheckBox
									key={checkbox.id}
									text={checkbox.text}
									checked={checkbox.checked}
									onPress={() => handleCheckboxChange(checkbox.id)}
								/>
							</View>
						))}
					</View>)
            }
				</View>
				<View>
					<CustomButton
						text='Apply'
						onClick={handleApply}
					/>
				</View>
			</View>
		</Container>
	)
}
