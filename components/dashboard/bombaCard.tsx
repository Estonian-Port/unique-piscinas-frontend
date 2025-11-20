import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { Bomba, PiscinaEquipos } from '@/data/domain/piscina';
import ModalEditarBomba from './modalEditarBomba';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';
import { Droplet, Edit2 } from 'react-native-feather';

const BombaCard = ({
  piscina,
  bomba,
  actualizarPiscina,
}: {
  piscina: PiscinaEquipos;
  bomba: Bomba;
  actualizarPiscina: () => Promise<void>;
}) => {
  const [modalEditOpen, setModalEditOpen] = useState(false);

  const handleSaveBomba = async (bombaEditada: Bomba) => {
    try {
      const response = await piscinaService.updateBomba(
        piscina.id,
        bombaEditada
      );
      setModalEditOpen(false);
      await actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Bomba actualizada',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar la bomba',
        text2: 'Intente nuevamente más tarde.',
        position: 'bottom',
      });
    }
  };

  return (
    <ScreenCard>
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center justify-between w-full">
          <View className="flex-row items-center">
            <Droplet color={'cyan'} />
            <Text className="text-text font-geist-semi-bold text-lg">
              Bomba {bomba.tipo}
            </Text>
          </View>
          <Pressable className="ml-2" onPress={() => setModalEditOpen(true)}>
            <Edit2 />
          </Pressable>
        </View>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Marca:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {bomba.marca}
        </Text>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Modelo:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {bomba.modelo}
        </Text>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Potencia:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {bomba.potencia}
        </Text>
      </View>
      {bomba.tipo === 'Principal' && (
        <View className="flex-row items-center justify-between">
          <Text className="text-text font-geist text-base">Estado:</Text>
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
      )}
      <ModalEditarBomba
        visible={modalEditOpen}
        bomba={bomba}
        onClose={() => setModalEditOpen(false)}
        onSave={handleSaveBomba}
      />
    </ScreenCard>
  );
};

export default BombaCard;
