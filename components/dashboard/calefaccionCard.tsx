import { View, Text, Switch, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { Calefaccion, PiscinaEquipos } from '@/data/domain/piscina';
import Toast from 'react-native-toast-message';
import { piscinaService } from '@/services/piscina.service';
import ModalEditarCalefaccion from './modalEditarCalefaccion';
import ModalEliminarEquipamiento from './modalEliminarEquipamiento';
import { Delete, Edit2, Thermometer, Trash2 } from 'react-native-feather';

const CalefaccionCard = ({
  calefaccion,
  piscina,
  actualizarPiscina,
}: {
  calefaccion: Calefaccion;
  piscina: PiscinaEquipos;
  actualizarPiscina: () => Promise<void>;
}) => {
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);

  const handleSaveCalefaccion = async (calefaccionEditada: Calefaccion) => {
    try {
      const response = await piscinaService.updateCalefaccion(
        piscina.id,
        calefaccionEditada
      );
      setModalEditOpen(false);
      await actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Calefacción actualizada',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar el germicida',
        text2: 'Intente nuevamente más tarde.',
        position: 'bottom',
      });
    }
  };

  const handleDeleteCalefaccion = async () => {
    try {
      const response = await piscinaService.deleteCalefaccion(piscina.id);
      setModalDeleteOpen(false);
      await actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Calefacción eliminada',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al eliminar la calefacción',
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
            <Thermometer color={'orange'} />
            <Text className="text-text font-geist-semi-bold text-lg">
              {calefaccion.tipo}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Pressable className="ml-2" onPress={() => setModalEditOpen(true)}>
              <Edit2 />
            </Pressable>
            <Pressable
              className="ml-2"
              onPress={() => setModalDeleteOpen(true)}
            >
              <Trash2 />
            </Pressable>
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Tipo:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {calefaccion.tipo}
        </Text>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Marca:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {calefaccion.marca}
        </Text>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Modelo:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {calefaccion.modelo}
        </Text>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Potencia:</Text>
        <Text className="font-geist-semi-bold tex-text text-base">
          {calefaccion.potencia} kW
        </Text>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-text font-geist text-base">Estado:</Text>
        <View
          className={`rounded-full px-2 ${
            calefaccion.activa ? 'bg-green-500' : 'bg-gray-500'
          }`}
        >
          <Text className="font-geist-semi-bold text-white text-sm">
            {calefaccion.activa ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      {modalEditOpen && (
        <ModalEditarCalefaccion
          visible={modalEditOpen}
          onClose={() => setModalEditOpen(false)}
          calefaccion={calefaccion}
          onSave={handleSaveCalefaccion}
        />
      )}
      {modalDeleteOpen && (
        <ModalEliminarEquipamiento
          visible={modalDeleteOpen}
          equipamiento="Calefacción"
          onClose={() => setModalDeleteOpen(false)}
          onDelete={handleDeleteCalefaccion}
        />
      )}
    </ScreenCard>
  );
};

export default CalefaccionCard;
