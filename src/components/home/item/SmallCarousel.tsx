import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Colors } from '@/src/constants/Colors';

interface SmallCarouselProps {
  images: string[];
  handleOpenImage: (image: string, index: number) => void
}

const SmallCarousel = ({ images ,handleOpenImage}: SmallCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const width = Dimensions.get('window').width;

  const flatListRef = useRef<FlatList<string>>(null);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index || 0;
      setActiveIndex(index);
    }
  }).current;

  // Автопрокрутка
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const nextIndex = (activeIndex + 1) % images.length;
  //     flatListRef.current?.scrollToIndex({ index: nextIndex });
  //     setActiveIndex(nextIndex);
  //   }, 5000);

  //   return () => clearInterval(interval); // Очищення при розмонтуванні
  // }, [activeIndex, images.length]);

  const openImage = () => {
    handleOpenImage(images[activeIndex], activeIndex)

  }

  const goToPrevious = () => {
    const prevIndex = activeIndex === 0 ? images.length - 1 : activeIndex - 1;
    flatListRef.current?.scrollToIndex({ index: prevIndex });
    setActiveIndex(prevIndex);
  };

  const goToNext = () => {
    const nextIndex = (activeIndex + 1) % images.length;
    flatListRef.current?.scrollToIndex({ index: nextIndex });
    setActiveIndex(nextIndex);
  };

  return (
    <View style={{ width: '100%', alignItems: 'center',  }} className='bg-black-600 border border-dark_gray pt-2 pb-1 rounded-2xl overflow-hidden mb-5'>
      {/* Карусель */}
      <View style={{ position: 'relative', width: width }}>
        {/* Кнопка ліворуч */}
        {/* <TouchableOpacity
          onPress={goToPrevious}
          // className='border border-dark_gray w-[30px] h-[30px] flex items-center justify-center'
          className='border border-dark_gray w-[30px] h-full flex items-center justify-center top-0 left-3 absolute z-[1] rounded-xl'
          
        >
          <Text style={{ color: 'white', fontSize: 16 }} className='text-center'>{'<'}</Text>
        </TouchableOpacity> */}

        {/* Карусель */}
        <FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          snapToAlignment="center"
          snapToInterval={width}
          decelerationRate="fast"
          data={images}
          keyExtractor={(image, index) => index.toString()}
          renderItem={({ item }) => (
            <View
            className='flex items-center justify-center '
              style={{
                width,
                height: 150,
                // justifyContent: 'center',
                // alignItems: 'center',

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

        {/* Кнопка праворуч */}
        {/* <TouchableOpacity
          onPress={goToNext}
          className='border border-dark_gray w-[30px] h-full flex items-center justify-center top-0 right-3 absolute z-1 rounded-xl'
        >
          <Text style={{ color: 'white', fontSize: 16 }}>{'>'}</Text>
        </TouchableOpacity> */}
      </View>

      <View style={{ flexDirection: 'row', marginTop: 10 }}>
        {images.map((_, index) => (
          <View
            key={index}
            style={{
              width: 7,
              height: 7,
              borderRadius: 5,
              backgroundColor: activeIndex === index ? Colors.dark.main : 'gray',
              marginHorizontal: 5,
            }}
          />
        ))}
      </View>
    </View>
  );
};

export default SmallCarousel;
