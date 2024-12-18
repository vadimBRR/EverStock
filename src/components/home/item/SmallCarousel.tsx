import React, { useRef, useState } from 'react'
import {
	View,
	Image,
	FlatList,
	Dimensions,
	TouchableOpacity,
} from 'react-native'
import { Colors } from '@/src/constants/Colors'

interface SmallCarouselProps {
	images: string[]
	handleOpenImage: (image: string, index: number) => void
}

const SmallCarousel = ({ images, handleOpenImage }: SmallCarouselProps) => {
	const [activeIndex, setActiveIndex] = useState<number>(0)
	const width = Dimensions.get('window').width

	const flatListRef = useRef<FlatList<string>>(null)

	const viewabilityConfig = {
		itemVisiblePercentThreshold: 50,
	}

	const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
		if (viewableItems.length > 0) {
			const index = viewableItems[0].index || 0
			setActiveIndex(index)
		}
	}).current


	const openImage = () => {
		handleOpenImage(images[activeIndex], activeIndex)
	}


	return (
		<View
			style={{ width: '100%', alignItems: 'center' }}
			className='bg-black-600 border border-dark_gray pt-2 pb-1 rounded-2xl overflow-hidden mb-5'
		>
			<View style={{ position: 'relative', width: width }}>

				<FlatList
					ref={flatListRef}
					horizontal
					pagingEnabled
					snapToAlignment='center'
					snapToInterval={width}
					decelerationRate='fast'
					data={images}
					keyExtractor={(image, index) => index.toString()}
					renderItem={({ item }) => (
						<View
							className='flex items-center justify-center '
							style={{
								width,
								height: 150,
							}}
						>
							<TouchableOpacity onPress={() => openImage()}>
								<Image
									source={{ uri: item }}
									style={{
										width: width,
										height: 150,
										resizeMode: 'contain',
									}}
								/>
							</TouchableOpacity>
						</View>
					)}
					onViewableItemsChanged={onViewableItemsChanged}
					viewabilityConfig={viewabilityConfig}
					showsHorizontalScrollIndicator={false}
				/>

			</View>

			<View style={{ flexDirection: 'row', marginTop: 10 }}>
				{images.map((_, index) => (
					<View
						key={index}
						style={{
							width: 7,
							height: 7,
							borderRadius: 5,
							backgroundColor:
								activeIndex === index ? Colors.dark.main : 'gray',
							marginHorizontal: 5,
						}}
					/>
				))}
			</View>
		</View>
	)
}

export default SmallCarousel
