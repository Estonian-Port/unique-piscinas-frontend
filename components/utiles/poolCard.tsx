import { View, Text, Image, Pressable } from 'react-native';
import React from 'react';
import { Link, router } from 'expo-router';
import { PiscinaListItem } from '@/data/domain/piscina';
import { useAuth } from '@/context/authContext';
import CustomPressable from './customPressable';

const PoolCard = ({ piscina }: { piscina: PiscinaListItem }) => {
  const { seleccionarPiscina } = useAuth();

  const handlePress = async () => {
    await seleccionarPiscina(piscina.id);
    router.replace(`/(tabs)/resume`);
  };

  return (
    <Link asChild href={`/(tabs)/resume`}>
      <CustomPressable
        className="bg-purple-unique rounded-sm shadow-sm w-full flex-row items-center"
        onPress={handlePress}
        style={{ overflow: 'visible' }}
      >
        <View style={{ marginLeft: -20, marginRight: 16 }}>
          <Image
            source={require('../../assets/images/logotipo-unique.png')}
            resizeMode="contain"
            style={{ width: 140, height: 140 }}
          />
        </View>
        <Text className="font-geist-semi-bold text-gold-unique text-xl">
          {piscina.direccion}
        </Text>
      </CustomPressable>
    </Link>
  );
};

export default PoolCard;
