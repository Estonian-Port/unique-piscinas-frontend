import { View, Text } from 'react-native';
import React from 'react';
import IndicadorEstado from './indicadorEstado';
import { Germicida } from '@/data/domain/piscina';

const GermicidaEquipamiento = ({ germicida }: { germicida: Germicida }) => {
  return (
    <View className="flex-row items-center justify-between mb-1">
      <View className="flex-row items-center self-start">
        <IndicadorEstado verde={germicida.activo} gris={!germicida.activo} />
        <View className="ml-2">
          <Text className="font-geist text-text text-base">
            {germicida.tipo}
          </Text>
          <Text className="font-geist-light text-text text-sm">
            {germicida.vidaRestante} horas restantes
          </Text>
        </View>
      </View>
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
  );
};

export default GermicidaEquipamiento;
