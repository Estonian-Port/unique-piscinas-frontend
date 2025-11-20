import { View, Text } from 'react-native';
import React from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import PressureGauge from './pressure';
import { PiscinaEquipamiento } from '@/data/domain/piscina';

const EstadoSistema = ({ pool }: { pool: PiscinaEquipamiento }) => {
  const formatDateTime = (iso?: string) => {
    if (!iso) return null;
    try {
      // Normalizar microsegundos (mantener 3 dígitos de milisegundos) para evitar problemas de parseo
      const normalized = iso.replace(/\.(\d{3})\d+/, '.$1');
      const date = new Date(normalized);
      if (isNaN(date.getTime())) return iso; // fallback al string original

      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');

      return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
    } catch (e) {
      return iso;
    }
  };
  return (
    <ScreenCard>
      <Text className="font-geist-semi-bold text-text text-3xl mb-3">
        Estado del Sistema
      </Text>

      <View className="flex-row justify-between items-center w-full mb-3">
        <Text className="font-geist-semi-bold text-text text-base">
          Estado del filtro:
        </Text>
        <View className="bg-gray-200 rounded-full p-2">
          <Text className="font-geist-semi-bold text-sm text-text">
            {pool.filtro.activo ? 'Activo' : 'Inactivo'}
          </Text>
        </View>
      </View>

      <View className="flex-row justify-between items-center w-full mb-5">
        <Text className="font-geist-semi-bold text-text text-base">
          Entradas de agua:
        </Text>
        <Text className="font-geist text-base text-text">
          {pool.entradaAgua.length === 0
            ? 'Ninguna'
            : pool.entradaAgua.join(', ')}
        </Text>
      </View>

      <View className="flex-row justify-between items-center w-full mb-5">
        <Text className="font-geist-semi-bold text-text text-base">
          Función activa:
        </Text>
        <Text className="font-geist text-base text-text">
          {pool.funcionActiva == 'REPOSO'
            ? 'Ninguno'
            : pool.funcionActiva.charAt(0).toUpperCase() +
              pool.funcionActiva.slice(1).toLowerCase()}
        </Text>
      </View>

      <View className="border-t border-gray-300 my-2"></View>

      <PressureGauge
        currentValue={pool.presion}
        minValue={0}
        maxValue={3}
      ></PressureGauge>

      <View className="flex-row justify-between items-center w-full mb-5">
        <Text className="font-geist-semi-bold text-text text-base">
          Última actividad:
        </Text>
        <Text className="font-geist text-base text-text">
          {pool.ultimaActividad
            ? formatDateTime(pool.ultimaActividad)
            : 'Sin actividad registrada'}
        </Text>
      </View>

      <View className="flex-row justify-between items-center w-full mb-5">
        <Text className="font-geist-semi-bold text-text text-base">
          Próximo ciclo filtrado:
        </Text>
        <Text className="font-geist text-base text-text">
          {pool.proximoCiclo ? pool.proximoCiclo : 'Sin ciclos programados'}
        </Text>
      </View>
    </ScreenCard>
  );
};

export default EstadoSistema;
