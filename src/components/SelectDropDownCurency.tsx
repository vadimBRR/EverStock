import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import SelectDropdown from 'react-native-select-dropdown'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { currency } from '@/src/constants/index'
import { currencyType } from '@/src/types/types'

type Props ={
  selectedValue:currencyType
  setSelectedValue:(value:currencyType) => void
  text?:string
}


const SelectDropDownCurency = ({selectedValue,
  setSelectedValue,text=''}:Props) => {
	
    
	return (
		<SelectDropdown
      disableAutoScroll

			data={currency}
			// defaultValueByIndex={8} // use default value by index or default value
			// defaultValue={{title: 'kiss', icon: 'emoticon-kiss-outline'}} // use default value by index or default value
			onSelect={(selectedItem, index) => {
				console.log(selectedItem, index)
        setSelectedValue(selectedItem)
			}}
			renderButton={(selectedItem, isOpen) => {
				return (
					<View className='' style={styles.dropdownButtonStyle}>
						<Text className='text-lg font-lexend_regular'>{text}</Text>
						<Text className='text-lg font-lexend_light text-white rounded-lg bg-gray p-1 px-2 w-[120px] text-center'>{selectedValue.name} - {selectedValue.value}</Text>
            
					</View>
				)
			}}
			renderItem={(item, index, isSelected) => {
				return (
					<View
						style={{
							...styles.dropdownItemStyle,
							...(isSelected && { backgroundColor: '#D2D9DF' }),
						}}

					>
						<Text style={styles.dropdownItemTxtStyle}>
							{item.name} ({item.value})
						</Text>
					</View>
				)
			}}
			dropdownStyle={styles.dropdownMenuStyle}
			showsVerticalScrollIndicator={false}
			search
			searchInputStyle={styles.dropdownSearchInputStyle}
			searchInputTxtColor={'#151E26'}
			searchPlaceHolder={'Search here'}
			searchPlaceHolderColor={'#72808D'}
			renderSearchInputLeftIcon={() => {
				return <FontAwesome name={'search'} color={'#72808D'} size={18} />
			}}
		/>
	)
}

export default SelectDropDownCurency

const styles = StyleSheet.create({
	
	dropdownButtonStyle: {
		width: '100%',
		// backgroundColor: 'rgba(0, 0, 0, 0.05)',
		borderRadius: 16,
		justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    marginTop: 12,
	},
	dropdownButtonTxtStyle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '500',
		color: '#151E26',
		textAlign: 'center',
	},
	dropdownMenuStyle: {
    marginTop: -40,

		backgroundColor: '#E9ECEF',
		borderRadius: 8,
	},
	dropdownSearchInputStyle: {
		backgroundColor: '#E9ECEF',
		borderRadius: 8,
		borderBottomWidth: 1,
		borderBottomColor: '#B1BDC8',
	},
	dropdownItemStyle: {
    // position:'absolute',
		width: '100%',
		flexDirection: 'row',
		paddingHorizontal: 12,
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 12,
		borderBottomWidth: 1,
		borderBottomColor: '#B1BDC8',
	},
	dropdownItemTxtStyle: {
		flex: 1,
		fontSize: 18,
		fontWeight: '500',
		color: '#151E26',
		textAlign: 'center',
	},
	dropdownItemIconStyle: {
		fontSize: 28,
		marginRight: 8,
	},
})
