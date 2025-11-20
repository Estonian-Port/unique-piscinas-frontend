import { Platform, Text, View } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';
import { Repeat } from 'react-native-feather';
import CustomPressable from './customPressable';

const BotonCambio = () => {
  return (
    <Link href={'/pools'} asChild>
      {Platform.OS === "web" ? (
          <CustomPressable className="border rounded-md bg-[#222247]">
            <View className='flex flex-row items-center justify-center py-3 px-4'>
              <Repeat className="font-geist-semi-bold text-white me-2"/>
              <Text className="font-geist-semi-bold text-white">Cambiar de piscina</Text>
            </View>
          </CustomPressable>
      ) : (
        <CustomPressable className="border rounded-md bg-[#222247] items-center justify-center px-4">
          <Repeat color="#fff" className="font-geist-semi-bold text-center py-2 px-4"/>
        </CustomPressable>
      )}
    </Link>
  );
};

export default BotonCambio;
