import { View, Text } from 'react-native';
import React from 'react';

// Este componente recibe dos props: 'verde' y 'gris' para determinar el estado del indicador
// Verde si el equipo está activo, gris si esta inactivo

const IndicadorEstado = ({
  verde = false,
  gris = false,
}: {
  verde: boolean;
  gris: boolean;
}) => {
  return (
    <View className="flex-row">
      {verde && <View className="w-2 h-2 rounded-full bg-green-600"></View>}
      {gris && <View className="w-2 h-2 rounded-full bg-gray-400"></View>}
    </View>
  );
};

export default IndicadorEstado;
