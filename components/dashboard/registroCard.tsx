import { View, Text, Pressable, Modal } from 'react-native';
import React, { useState } from 'react';
import { Registro } from '@/data/domain/piscina';
import ModalEditarRegistro from './modalEditarRegistro';
import ModalEliminarEquipamiento from './modalEliminarEquipamiento';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';
import { Calendar, Edit2, Info, Settings, Wrench, Trash2 } from 'lucide-react-native';

const RegistroCard = ({
  registro,
  piscinaId,
  actualizarPiscina,
}: {
  registro: Registro;
  piscinaId: number;
  actualizarPiscina: () => void;
}) => {
  const [modalEditActivo, setModalEditActivo] = useState(false);
  const [modalDeleteActivo, setModalDeleteActivo] = useState(false);

  const handleDeleteRegistro = async () => {
    try {
      const response = await piscinaService.eliminarRegistro(
        registro.id,
        piscinaId
      );
      Toast.show({
        type: 'success',
        text1: 'Registro eliminado',
        text2: response.message,
        position: 'bottom',
      });
      actualizarPiscina();
    } catch (error) {
      console.error('Error eliminando registro:', error);
    } finally {
      setModalDeleteActivo(false);
    }
  };

  return (
    <View className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mb-4">
      {/* Encabezado con la acción */}
      <View className="flex-row bg-purple-unique px-4 py-3 border-b border-gray-100 justify-between items-center">
        <Text className="text-white font-geist-semi-bold text-base">
          {registro.accion}
        </Text>
        <View className="flex-row gap-3">
          <Pressable onPress={() => setModalEditActivo(true)}>
            <Edit2 color="#FFF" />
          </Pressable>
          <Pressable onPress={() => setModalDeleteActivo(true)}>
            <Trash2 color="#FFF" />
          </Pressable>
        </View>
      </View>

      {/* Contenido principal */}
      <View className="p-4">
        {/* Fecha y dispositivo */}
        <View className="flex-row mb-4">
          <View className="flex-1 flex-row items-center mr-2">
            <Calendar color="#666" className="mr-2" />
            <View>
              <Text className="text-gray-500 text-xs mb-1">Fecha</Text>
              <Text className="text-gray-800 font-geist-semi-bold text-sm">
                {registro.fecha}
              </Text>
            </View>
          </View>

          <View className="flex-1 flex-row items-center">
            <Settings width={16} height={16} color="#666" className="mr-2" />
            <View>
              <Text className="text-gray-500 text-xs mb-1">Dispositivo</Text>
              <Text className="text-gray-800 font-geist-semi-bold text-sm">
                {registro.dispositivo}
              </Text>
            </View>
          </View>
        </View>

        {/* Descripción */}
        <View className="mb-4 bg-gray-100 rounded-lg">
          <View className="flex-row items-center px-3 pt-3 mb-1">
            <Info width={14} height={14} color="#666" className="mr-1" />
            <Text className="text-gray-500 text-xs">Descripción</Text>
          </View>
          <Text className="text-gray-800 text-sm px-3 pb-3">
            {registro.descripcion}
          </Text>
        </View>

        {/* Técnico */}
        <View className="flex-row items-center bg-gray-100 rounded-lg">
          <View className="h-8 w-8 ml-3 rounded-full bg-gray-200 items-center justify-center mr-3">
            <Wrench width={16} height={16} color="#666" />
          </View>
          <View className="py-3">
            <Text className="text-gray-500 text-xs mb-1">Técnico</Text>
            <Text className="text-gray-800 font-geist-semi-bold text-sm">
              {registro.nombreTecnico}
            </Text>
          </View>
        </View>
        <ModalEditarRegistro
          visible={modalEditActivo}
          onClose={() => setModalEditActivo(false)}
          registro={registro}
          actualizarPiscina={() => actualizarPiscina()}
          piscinaId={piscinaId}
        />
        <ModalEliminarEquipamiento
          visible={modalDeleteActivo}
          onClose={() => setModalDeleteActivo(false)}
          equipamiento={'Registro'}
          onDelete={() => handleDeleteRegistro()}
        />
      </View>
    </View>
  );
};

export default RegistroCard;
