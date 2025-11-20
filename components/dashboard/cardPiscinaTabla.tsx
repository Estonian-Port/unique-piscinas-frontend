import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { PiscinaRegistrada as PiscinaRegistrada } from '@/data/domain/piscina';
import { useAuth } from '@/context/authContext';
import {
  Book,
  ChevronDown,
  ChevronUp,
  Clock,
  Droplet,
  Eye,
  Info,
  Tag,
  User,
  Settings,
} from 'react-native-feather';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';
import CustomPressable from '../utiles/customPressable';

// Componente para mostrar el estado del pH con color contextual
const PhIndicator = ({ value }: { value: number }) => {
  // Determinar el color basado en el valor del pH
  const getColor = () => {
    if (value < 7.2) return '#F44336'; // Ácido - rojo
    if (value > 7.8) return '#2196F3'; // Alcalino - azul
    return '#4CAF50'; // Ideal - verde
  };

  return (
    <View className="flex-row items-center">
      <View
        className="h-3 w-3 rounded-full mr-2"
        style={{ backgroundColor: getColor() }}
      />
      <Text className="font-geist-semi-bold text-base">{value}</Text>
    </View>
  );
};

// Componente para mostrar un equipo con su ícono y estado
const EquipmentItem = ({
  tipo,
  estado,
}: {
  tipo: string;
  estado:
    | 'Operativo'
    | 'Requiere revisión'
    | 'Reemplazo urgente'
    | 'Mantenimiento';
}) => {
  const getIcon = () => {
    switch (tipo) {
      case 'UV':
        return 'electric-bolt';
      case 'Ionizador de cobre':
        return 'lightbulb';
      case 'Trasductor de ultrasonido':
        return 'waves';
      case 'Calentador':
        return 'thermostat';
      default:
        return 'device-unknown';
    }
  };

  const getStatusColor = () => {
    switch (estado) {
      case 'Operativo':
        return '#4CAF50'; // Verde
      case 'Requiere revisión':
        return '#FF9800'; // Naranja
      case 'Reemplazo urgente':
        return '#F44336'; // Rojo
      case 'Mantenimiento':
        return '#9E9E9E'; // Gris
      default:
        return '#9E9E9E';
    }
  };

  return (
    <View className="items-center bg-gray-50 p-3 rounded-lg">
      <MaterialIcons name={getIcon()} size={24} color={getStatusColor()} />
      <Text className="font-geist text-text text-xs mt-1 text-center">{tipo}</Text>
      <View
        className="mt-1 px-2 py-1 rounded-full"
        style={{ backgroundColor: getStatusColor() + '20' }}
      >
        <Text
          className="text-xs font-geist-semi-bold text-center"
          style={{ color: getStatusColor() }}
        >
          {estado}
        </Text>
      </View>
    </View>
  );
};

const PoolTableCard = ({ pool }: { pool: PiscinaRegistrada }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { seleccionarPiscina, selectedPool } = useAuth();

  const handleFicha = async () => {
    try {
      await seleccionarPiscina(pool.id);
      router.push('/fichaTecnica');
    } catch (error) {
      console.error('Error seleccionando piscina:', error);
      // Aquí podrías mostrar un toast de error
    }
  };

  const handlePanel = async () => {
    try {
      await seleccionarPiscina(pool.id);
      router.push('/(tabs)/resume');
    } catch (error) {
      console.error('Error seleccionando piscina:', error);
    }
  };

  const handleEquipos = async () => {
    try {
      await seleccionarPiscina(pool.id);
      router.push('/equipos');
    } catch (error) {
      console.error('Error seleccionando piscina:', error);
    }
  };

  const handleLecturas = async () => {
    try {
      await seleccionarPiscina(pool.id);
      router.push('/lecturas');
    } catch (error) {
      console.error('Error seleccionando piscina:', error);
    }
  };

  const handleLecturaManual = async () => {
    try {
      await piscinaService.realizarLectura(pool.id);
      Toast.show({
        type: 'success',
        text1: 'Lectura manual realizada',
        text2: 'La lectura manual se ha realizado con éxito.',
      });
    } catch (error) {
      console.error('Error realizando lectura manual:', error);
    }
  };

  return (
    <View className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 mb-4">
      {/* Encabezado con nombre y tipo */}
      <Pressable
        className="flex-row items-center"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text
          className="font-geist-semi-bold text-text text-lg flex-1"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {pool.direccion}
        </Text>
        {isExpanded ? (
          <ChevronUp height={20} width={20} color="#333" />
        ) : (
          <ChevronDown height={20} width={20} color="#333" />
        )}
      </Pressable>

      {isExpanded && (
        <>
          {/* Información principal */}
          <View className="border-b border-gray-200 pb-4 mb-4 mt-2 gap-2">
            <View className="flex-row items-center">
              <User height={16} width={16} color="#666" className="mr-2" />
              <Text className="text-gray-500 font-geist text-sm mr-2">
                Administrador:
              </Text>
              <Text className="text-text font-geist-semi-bold text-sm">
                {pool.nombreAdministrador}
              </Text>
            </View>

            <View className="flex-row items-center">
              <Tag height={16} width={16} color="#666" className="mr-2" />
              <Text className="text-gray-500 font-geist text-sm mr-2">
                Tipo:
              </Text>
              <View className="bg-gray-900 rounded-full px-3 py-1">
                <Text className="font-geist-semi-bold text-white text-xs">
                  {pool.esDesbordante ? 'Infinity' : 'Skimmer'}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Droplet height={16} width={16} color="#666" className="mr-2" />
              <Text className="text-gray-500 font-geist text-sm mr-2">pH:</Text>
              <PhIndicator value={pool.ph} />
            </View>

            <View className="flex-row items-center">
              <Book height={16} width={16} color="#666" className="mr-2" />
              <Text className="text-gray-500 font-geist text-sm mr-2">
                Lecturas
              </Text>
            </View>

            <View className="flex-row justify-between mt-2">
              <CustomPressable
                className="bg-grayish-unique rounded-lg py-3 flex-1 mr-3 flex-row items-center justify-center"
                onPress={handleLecturaManual}
                containerClassName='w-1/2'
              >
                <Book height={16} width={16} className="mr-2" />
                <Text className="text-black font-geist-semi-bold text-sm">
                  Nueva lectura
                </Text>
              </CustomPressable>
              <CustomPressable
                className="bg-grayish-unique rounded-lg py-3 flex-1 flex-row items-center justify-center"
                onPress={handleLecturas}
                containerClassName='w-1/2'
              >
                <Clock height={16} width={16} className="mr-2" />
                <Text className="text-black font-geist-semi-bold text-sm">
                  Ver historial
                </Text>
              </CustomPressable>
            </View>
          </View>

          {/* Sistemas germicidas */}
          <Text className="text-gray-700 font-geist-semi-bold text-sm mb-3">
            Sistemas germicidas:
          </Text>
          <View className="flex-row flex-wrap justify-between mb-4 ">
            {pool.sistemasGermicidas.map((sistema, index) => (
              <View key={index} className="w-[48%] mb-2">
                <EquipmentItem
                  tipo={sistema.tipo}
                  estado={
                    sistema.estado as
                      | 'Operativo'
                      | 'Requiere revisión'
                      | 'Reemplazo urgente'
                      | 'Mantenimiento'
                  }
                />
              </View>
            ))}
          </View>

          {/* Acciones */}

          <View className="flex-row justify-between mt-2">
            <CustomPressable
              className="bg-gray-900 rounded-lg py-3 flex-1 mr-3 flex-row items-center justify-center"
              onPress={handleFicha}
              containerClassName='w-1/3'
            >
              <Info height={16} width={16} color="#fff" />
              <Text className="text-white font-geist-semi-bold text-sm ml-2">
                Ficha
              </Text>
            </CustomPressable>
            <CustomPressable
              className="bg-gray-900 rounded-lg py-3 flex-1 mr-3 flex-row items-center justify-center"
              onPress={handlePanel}
              containerClassName='w-1/3'
            >
              <Eye height={16} width={16} color="#fff" />
              <Text className="text-white font-geist-semi-bold text-sm ml-2">
                Panel
              </Text>
            </CustomPressable>
            <CustomPressable
              className="bg-gray-900 rounded-lg py-3 flex-1 flex-row items-center justify-center"
              onPress={handleEquipos}
              containerClassName='w-1/3'
            >
              <Settings height={16} width={16} color="#fff" />
              <Text className="text-white font-geist-semi-bold text-sm ml-2">
                Equipos
              </Text>
            </CustomPressable>
          </View>
        </>
      )}
    </View>
  );
};

export default PoolTableCard;
