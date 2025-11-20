import { View, Text, Switch, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { Filtro, PiscinaEquipos } from '@/data/domain/piscina';
import ModalEditarFiltro from './modalEditarFiltro';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';
import { Edit2, Filter, RefreshCw } from 'react-native-feather';
import ModalResetearContador from './modalResetearContador';
import CustomPressable from '../utiles/customPressable';

const FiltroCard = ({
  filtro,
  piscina,
  actualizarPiscina,
}: {
  filtro: Filtro;
  piscina: PiscinaEquipos;
  actualizarPiscina: () => void;
}) => {
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalResetOpen, setModalResetOpen] = useState(false);

  const resetearContadorFiltro = async () => {
    try {
      const response = await piscinaService.resetearContadorFiltro(
        piscina.id,
        filtro.id
      );
      setModalResetOpen(false);
      await actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Contador reseteado',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al resetear el contador',
        text2: 'Intente nuevamente más tarde.',
        position: 'bottom',
      });
    }
  };

  const handleSaveFiltro = async (filtroEditado: Filtro) => {
    try {
      const response = await piscinaService.updateFiltro(
        piscina.id,
        filtroEditado
      );
      setModalEditOpen(false);
      await actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Filtro actualizado',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar el filtro',
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
            <Filter color={'cyan'} />
            <Text className="text-text font-geist-semi-bold text-lg">
              Filtro de {filtro.tipo}
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
          {filtro.marca}
        </Text>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Modelo:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {filtro.modelo}
        </Text>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Diámetro:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {filtro.diametro}
        </Text>
      </View>

      <View className="flex-row items-center justify-between mb-1">
        <Text className="font-geist text-text text-base">
          {filtro.tipo === 'Arena'
            ? 'Cantidad de arena (kg)'
            : filtro.tipo === 'Vidrio'
            ? 'Cantidad de vidrio (kg)'
            : 'Micras del cartucho'}
        </Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {filtro.datoExtra}
        </Text>
      </View>

      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">
          Vida restante aprox.:
        </Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {filtro.vidaRestante}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Text className="text-text font-geist text-base">Estado:</Text>
        <View
          className={`rounded-full px-2 ${
            filtro.activo ? 'bg-green-500' : 'bg-gray-500'
          }`}
        >
          <Text className="font-geist-semi-bold text-white text-sm">
            {filtro.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      <CustomPressable
        className="flex-row rounded-lg bg-black py-2 items-center justify-center mt-2"
        onPress={() => setModalResetOpen(true)}
      >
        <RefreshCw color={'white'} height={20} width={20} />
        <Text className="text-white font-geist text-base ml-2">
          Resetear contador
        </Text>
      </CustomPressable>
      <ModalEditarFiltro
        visible={modalEditOpen}
        filtro={filtro}
        onClose={() => setModalEditOpen(false)}
        onSave={handleSaveFiltro}
      />
      <ModalResetearContador
        visible={modalResetOpen}
        onSave={resetearContadorFiltro}
        onClose={() => setModalResetOpen(false)}
      />
    </ScreenCard>
  );
};

export default FiltroCard;
