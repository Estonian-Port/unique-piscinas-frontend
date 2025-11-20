import { View, Text } from 'react-native';
import React from 'react';
import IndicadorEstado from './indicadorEstado';
import { Bomba } from '@/data/domain/piscina';

const BombaCard = ({
  bomba,
  esBombaPrincipal,
}: {
  bomba: Bomba;
  esBombaPrincipal: boolean;
}) => {
  return (
    <View className="flex-row items-center justify-between mb-1">
      <View className="flex-row items-center self-start">
        <IndicadorEstado verde={bomba.activa} gris={!bomba.activa} />
        <Text className="font-geist text-text text-base ml-2">
          {esBombaPrincipal ? 'Bomba Principal' : 'Bomba Secundaria'}
        </Text>
      </View>
      <View
        className={`rounded-full px-2 ${
          bomba.activa ? 'bg-green-500' : 'bg-gray-500'
        }`}
      >
        <Text className="font-geist-semi-bold text-white text-sm">
          {bomba.activa ? 'Activa' : 'Inactiva'}
        </Text>
      </View>
    </View>
  );
};

export default BombaCard;
