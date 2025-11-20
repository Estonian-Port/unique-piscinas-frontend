import { View, Text, Switch, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { Germicida, PiscinaEquipos } from '@/data/domain/piscina';
import ModalEditarGermicida from './modalEditarGermicida';
import Toast from 'react-native-toast-message';
import { piscinaService } from '@/services/piscina.service';
import ModalEliminarEquipamiento from './modalEliminarEquipamiento';
import { Delete, Edit2, RefreshCw } from 'react-native-feather';
import ModalResetearContador from './modalResetearContador';
import CustomPressable from '../utiles/customPressable';

const GermicidaCard = ({
  germicida,
  piscina,
  actualizarPiscina,
}: {
  germicida: Germicida;
  piscina: PiscinaEquipos;
  actualizarPiscina: () => void;
}) => {
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [modalResetOpen, setModalResetOpen] = useState(false);

  const resetearContadorGermicida = async () => {
    try {
      const response = await piscinaService.resetearContadorGermicida(
        piscina.id,
        germicida.id
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

  const handleSaveGermicida = async (germicidaEditado: Germicida) => {
    try {
      const response = await piscinaService.updateGermicida(
        piscina.id,
        germicidaEditado
      );
      setModalEditOpen(false);
      await actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Germicida actualizado',
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

  const handleDeleteGermicida = async () => {
    try {
      const response = await piscinaService.deleteGermicida(
        piscina.id,
        germicida.id
      );
      setModalDeleteOpen(false);
      await actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Germicida eliminado',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al eliminar el germicida',
        text2: 'Intente nuevamente más tarde.',
        position: 'bottom',
      });
    }
  };

  return (
    <ScreenCard>
      <View className="flex-row items-center justify-between mb-1">
        <View className="flex-row items-center justify-between w-full">
          <Text className="text-text font-geist-semi-bold text-lg">
            {germicida.tipo}
          </Text>
          <View className="flex-row items-center">
            <Pressable className="ml-2" onPress={() => setModalEditOpen(true)}>
              <Edit2 />
            </Pressable>
            <Pressable
              className="ml-2"
              onPress={() => setModalDeleteOpen(true)}
            >
              <Delete />
            </Pressable>
          </View>
        </View>
      </View>
      <View className="flex-row items-center justify-between">
        <Text className="text-text font-geist text-base">Estado:</Text>
        <View
          className={`rounded-full px-2 ${
            germicida.activo ? 'bg-green-500' : 'bg-gray-500'
          }`}
        >
          <Text className="font-geist-semi-bold text-white text-sm">
            {germicida.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center justify-between my-1">
        <Text className="text-text font-geist text-base">Marca:</Text>
        <Text className="font-geist-semi-bold text-text text-base">
          {germicida.marca}
        </Text>
      </View>
      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">
          {germicida.tipo == 'UV' || germicida.tipo == 'Trasductor'
            ? 'Potencia:'
            : 'Electrodos:'}
        </Text>
        <Text className="font-geist-semi-bold text-text text-base">
          {germicida.datoExtra} kW
        </Text>
      </View>

      <View className="flex-row items-center justify-between mb-1">
        <Text className="text-text font-geist text-base">Vida restante:</Text>
        <View className="flex-row items-center">
          <Text className="font-geist-semi-bold text-text text-base">
            {`${germicida.vidaRestante} hs restantes - `}
          </Text>
          {(() => {
            const estado = germicida.estado ?? '';
            const bgBorder =
              {
                Operativo: 'bg-green-300 border-green-500',
                'Requiere revisión': 'bg-yellow-200 border-yellow-300',
                'Reemplazo urgente': 'bg-orange-300 border-orange-500',
                Mantenimiento: 'bg-red-300 border-red-500',
              }[estado] ?? 'bg-gray-100 border-gray-200';

            const textColor =
              {
                Operativo: 'text-green-800',
                'Requiere revisión': 'text-yellow-800',
                'Reemplazo urgente': 'text-orange-800',
                Mantenimiento: 'text-red-800',
              }[estado] ?? 'text-gray-800';

            return (
              <View
                className={`flex-row items-center justify-center rounded-xl p-0.5 border ${bgBorder}`}
              >
                <Text className={`font-geist text-sm mx-1 ${textColor}`}>
                  {estado}
                </Text>
              </View>
            );
          })()}
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
      <ModalEditarGermicida
        visible={modalEditOpen}
        germicida={germicida}
        onClose={() => setModalEditOpen(false)}
        onSave={handleSaveGermicida}
      />
      <ModalEliminarEquipamiento
        visible={modalDeleteOpen}
        equipamiento={`Germicida ${germicida.tipo}`}
        onClose={() => setModalDeleteOpen(false)}
        onDelete={handleDeleteGermicida}
      />
      <ModalResetearContador
        visible={modalResetOpen}
        onSave={resetearContadorGermicida}
        onClose={() => setModalResetOpen(false)}
      />
    </ScreenCard>
  );
};

export default GermicidaCard;
