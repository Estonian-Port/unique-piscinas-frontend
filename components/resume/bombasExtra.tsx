import { View, Text, Switch } from 'react-native';
import React, { Dispatch, SetStateAction, useState } from 'react';
import { Bomba, PiscinaResume } from '@/data/domain/piscina';
import { ScreenCard } from '../utiles/ScreenCard';
import { estadoPiscinaService } from '@/services/estadoPiscina.service';
import Toast from 'react-native-toast-message';

const BombaItem = ({
  bomba,
  poolId,
  onUpdate,
}: {
  bomba: Bomba;
  poolId: number;
  onUpdate?: () => Promise<void> | void;
}) => {
  const [updating, setUpdating] = useState(false);

  const handleSwitchRequest = async (valor: boolean) => {
    if (updating) return; // Prevenir clicks múltiples

    try {
      setUpdating(true);
      await estadoPiscinaService.actualizarEstadoBombaExtra(
        poolId,
        bomba.id,
        valor
      );

      await onUpdate?.();
    } catch (error) {
      console.error('Error al actualizar estado de bomba extra:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar la bomba.',
        position: 'bottom',
      });
    } finally {
      setUpdating(false);
    }
  };

  const cardStyle = (active: boolean) =>
    `rounded-lg py-2 px-4 my-2 w-full justify-between flex-row items-center ${
      active ? 'bg-gray-100' : 'bg-gray-100 opacity-50'
    }`;

  return (
    <View className={cardStyle(bomba.activa)}>
      <Text className="font-geist-semi-bold text-text mr-2">{bomba.tipo}</Text>
      <Switch
        trackColor={{ false: '#d3d3d3', true: '#000000' }}
        thumbColor={bomba.activa ? '#fcdb99' : '#ffffff'}
        ios_backgroundColor="#d3d3d3"
        value={bomba.activa}
        onValueChange={handleSwitchRequest}
        disabled={updating}
      />
    </View>
  );
};

const BombasExtra = ({
  bombas,
  poolId,
  onUpdate,
}: {
  bombas: Bomba[];
  poolId: number;
  onUpdate?: () => Promise<void> | void;
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
            onUpdate={onUpdate}
          />
        ))}
      </View>
    </ScreenCard>
  );
};

export default BombasExtra;
