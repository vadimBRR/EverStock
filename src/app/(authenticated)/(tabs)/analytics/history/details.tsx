import { View, Text } from 'react-native';
import React from 'react';
import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';
import Container from '@/src/components/Container';
import { useAccount } from '@/src/providers/AccountProvider';
import { itemType } from '@/src/types/types';

const HistoryDetailed = () => {
  const { id: idString, folder_id: folderIdString } = useLocalSearchParams();

  const id = parseFloat(
    idString ? (typeof idString === 'string' ? idString : idString[0]) : ''
  );
  const folder_id = parseFloat(
    folderIdString
      ? typeof folderIdString === 'string'
        ? folderIdString
        : folderIdString[0]
      : ''
  );

  const transaction = useAccount()
    .transactions.find(transaction => transaction.folder_id === folder_id)
    ?.info.find(info => info.id === id);

  // Функція для знаходження відмінностей
  const findDifferences = (
    prev_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>,
    changed_item: Omit<itemType, 'created_at' | 'folder_id' | 'user_id'>
  ): Partial<Record<keyof typeof prev_item, { prev: any; changed: any }>> => {
    const differences: Partial<
      Record<keyof typeof prev_item, { prev: any; changed: any }>
    > = {};

    (Object.keys(prev_item) as (keyof typeof prev_item)[]).forEach(key => {
      if (
        JSON.stringify(prev_item[key]) !== JSON.stringify(changed_item[key])
      ) {
        differences[key] = {
          prev: prev_item[key],
          changed: changed_item[key],
        };
      }
    });

    return differences;
  };

  const differences = transaction
    ? findDifferences(transaction.prev_item, transaction.changed_item)
    : {};

  return (
    <Container isPadding={false} container_style="mx-2 pt-2">
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'History',
          headerTitleAlign: 'center',
          headerStyle: { backgroundColor: '#242121' },
          headerTintColor: '#fff',
        }}
      />
      <ScrollView contentContainerStyle={{ gap: 10 }}>
        <View>
          <View className='bg-black-600 p-2 flex-row justify-between'>
            <Text className="text-white font-lexend_semibold text-lg">Full name:</Text>
            <Text className="text-white font-lexend_light text-lg">Vadym Brovych</Text>

          </View>
          {/* Full Name */}

          {/* Item */}
          <Text className="text-white font-bold">Item:</Text>
          <Text className="text-gray-300">{transaction?.changed_item?.name}</Text>

          {/* Action */}
          <Text className="text-white font-bold">Action:</Text>
          <Text className="text-gray-300">Updated Quantity</Text>

          {/* Відображаємо всі зміни */}
          {Object.entries(differences).map(([key, value]) => (
            <View key={key}>
              <Text className="text-white font-bold">
                {`Prev. ${key.charAt(0).toUpperCase() + key.slice(1)}:`}
              </Text>
              <Text className="text-gray-300">{value.prev}</Text>

              <Text className="text-white font-bold">
                {`New ${key.charAt(0).toUpperCase() + key.slice(1)}:`}
              </Text>
              <Text className="text-gray-300">{value.changed}</Text>
            </View>
          ))}

          {/* Time */}
          <Text className="text-white font-bold">Time:</Text>
          <Text className="text-gray-300">
            {transaction?.date && new Date(transaction?.date).toLocaleTimeString()}
          </Text>

          {/* Date */}
          <Text className="text-white font-bold">Date:</Text>
          <Text className="text-gray-300">
            {transaction?.date && new Date(transaction?.date).toLocaleDateString()}
          </Text>
        </View>
      </ScrollView>
    </Container>
  );
};

export default HistoryDetailed;
