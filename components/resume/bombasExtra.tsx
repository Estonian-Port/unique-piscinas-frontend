import { View, Text, Switch } from 'react-native';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Bomba, PiscinaResume } from '@/data/domain/piscina';
import { ScreenCard } from '../utiles/ScreenCard';
import { estadoPiscinaService } from '@/services/estadoPiscina.service';

const BombaItem = ({
  bomba,
  poolId,
  setPiscina,
}: {
  bomba: Bomba;
  poolId: number;
  setPiscina: Dispatch<SetStateAction<PiscinaResume | null>>;
}) => {
  const [bombaActiva, setBombaActiva] = useState(bomba.activa);

  const handleSwitchRequest = async (valor: boolean) => {
    try {
      const response = await estadoPiscinaService.actualizarEstadoBombaExtra(
        poolId,
        bomba.id,
        valor
      );
      setBombaActiva(valor);
    } catch (error) {
      console.error('Error al actualizar estado de bomba extra:', error);
    }
  };

  const cardStyle = (active: boolean) =>
    `rounded-lg py-2 px-4 my-2 w-full justify-between flex-row items-center ${
      active ? 'bg-gray-100' : 'bg-gray-100 opacity-50'
    }`;

  return (
    <View className={cardStyle(bombaActiva)}>
      <Text className="font-geist-semi-bold text-text mr-2">{bomba.tipo}</Text>
      <Switch
        trackColor={{ false: '#d3d3d3', true: '#000000' }}
        thumbColor={bombaActiva ? '#fcdb99' : '#ffffff'}
        ios_backgroundColor="#d3d3d3"
        value={bombaActiva}
        onValueChange={(v) => handleSwitchRequest(v)}
      />
    </View>
  );
};

const BombasExtra = ({
  bombas,
  setPiscina,
  poolId,
}: {
  bombas: Bomba[];
  setPiscina: Dispatch<SetStateAction<PiscinaResume | null>>;
  poolId: number;
}) => {
  return (
    <ScreenCard>
      <View className="flex-column justify-between items-center mb-4">
        <Text className="font-geist-semi-bold text-2xl text-text text-left w-full mb-4">
          Bombas extra
        </Text>
        {bombas.map((bomba, index) => (
          <BombaItem
            key={index}
            bomba={bomba}
            poolId={poolId}
            setPiscina={setPiscina}
          />
        ))}
      </View>
    </ScreenCard>
  );
};

export default BombasExtra;
