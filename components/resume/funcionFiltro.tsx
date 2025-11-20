import { funcionFiltro } from '@/data/domain/piscina';
import type React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import {
  Filter,
  RefreshCw,
  Trash2,
  Droplet,
  RotateCcw,
  Power,
} from 'react-native-feather';
import { Image } from 'react-native';
import Toast from 'react-native-toast-message';

interface ControlButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  position: 'top' | 'right' | 'bottom-left' | 'bottom-right' | 'left';
  activo: boolean;
  isSelected: boolean;
}

const ControlButton = ({
  icon,
  label,
  onPress,
  position,
  activo,
  isSelected,
}: ControlButtonProps) => {
  const positionStyles = {
    top: 'absolute -top-10 left-20 ml-2',
    right: 'absolute top-10 -right-5',
    left: 'absolute top-10 -left-5',
    'bottom-left': 'absolute bottom-0 left-0',
    'bottom-right': 'absolute bottom-0 right-0',
  }[position];

  return (
    <View className={`${positionStyles}`}>
      <TouchableOpacity
        onPress={onPress}
        className={`items-center justify-center w-20 h-20 rounded-full bg-grayish-unique
        ${
          isSelected
            ? 'border-2 border-grayish-unique bg-purple-unique'
            : 'border border-gray-400'
        }`}
        style={{ opacity: !activo ? 0.4 : 1 }}
        disabled={!activo}
      >
        <View className="items-center justify-center">
          {icon}
          <Text
            className={`text-text font-geist text-xs mt-1 ${
              isSelected ? 'text-white' : ''
            }`}
          >
            {label}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

interface PanelFuncionesFiltroProps {
  botonesActivos: boolean;
  onChange: (funcion: funcionFiltro) => void | Promise<void>;
  funcionActiva: funcionFiltro;
  opacidad?: number;
  skimmerActivo: boolean;
  barrefondoActivo: boolean;
  onReset: () => void;
}

const PanelFuncionesFiltro = ({
  botonesActivos,
  onChange: onChange,
  funcionActiva,
  skimmerActivo,
  barrefondoActivo,
  onReset,
}: PanelFuncionesFiltroProps) => {
  const hayFuncionActiva = funcionActiva !== 'REPOSO';

  const resetearSistema = () => {
    onReset();
    Toast.show({
      type: 'success',
      text1: 'Sistema reseteado',
      position: 'bottom',
    });
  };

  return (
    <View className="flex-1 items-center justify-center w-full mt-5">
      <View className="relative w-64 h-64">
        
        {true && (
          <Pressable
            className={`absolute top-1/2 left-1/2 -mt-16 -ml-16 w-32 h-32 rounded-full items-center justify-center ${
              hayFuncionActiva ? 'bg-grayish-unique' : 'bg-grayish-unique'
            }`}
            style={{ opacity: !botonesActivos ? 0.4 : 1 }}
            disabled={!hayFuncionActiva}
            onPress={resetearSistema}
          >
            <Power
              stroke={hayFuncionActiva ? '#D30000' : '#ceccd9'}
              width={32}
              height={32}
            />
          </Pressable>
        )}

        {false && (
          <View
            className={`absolute top-1/2 left-1/2 -mt-16 -ml-16 w-32 h-32 rounded-full items-center justify-center bg-white shadow ${
              hayFuncionActiva
                ? 'border-2 border-green-500 shadow-green-500'
                : ''
            }`}
            style={{ opacity: !hayFuncionActiva ? 0.4 : 1 }}
          >
            <Image
              source={require('../../assets/images/logotipo-unique.png')}
              style={{ width: 100, height: 100, borderRadius: 50 }}
              resizeMode="contain"
            />
          </View>
        )}

        <ControlButton
          icon={
            <Filter
              stroke={funcionActiva === 'FILTRAR' ? '#FFF' : '#4e4965'}
              width={24}
              height={24}
            />
          }
          label="Filtrar"
          onPress={() => onChange('FILTRAR')}
          position="top"
          activo={botonesActivos}
          isSelected={funcionActiva === 'FILTRAR'}
        />

        <ControlButton
          icon={
            <RefreshCw
              stroke={funcionActiva === 'RETROLAVAR' ? '#FFF' : '#4e4965'}
              width={24}
              height={24}
            />
          }
          label="Retrolavar"
          onPress={() => onChange('RETROLAVAR')}
          position="right"
          activo={botonesActivos && !barrefondoActivo}
          isSelected={funcionActiva === 'RETROLAVAR'}
        />

        <ControlButton
          icon={
            <Droplet
              stroke={funcionActiva === 'ENJUAGAR' ? '#FFF' : '#4e4965'}
              width={24}
              height={24}
            />
          }
          label="Enjuagar"
          onPress={() => onChange('ENJUAGAR')}
          position="bottom-right"
          activo={botonesActivos && !barrefondoActivo}
          isSelected={funcionActiva === 'ENJUAGAR'}
        />

        <ControlButton
          icon={
            <Trash2
              stroke={funcionActiva === 'DESAGOTAR' ? '#FFF' : '#4e4965'}
              width={24}
              height={24}
            />
          }
          label="Desagotar"
          onPress={() => onChange('DESAGOTAR')}
          position="bottom-left"
          activo={botonesActivos && !skimmerActivo}
          isSelected={funcionActiva === 'DESAGOTAR'}
        />

        <ControlButton
          icon={
            <RotateCcw
              stroke={funcionActiva === 'RECIRCULAR' ? '#FFF' : '#4e4965'}
              width={24}
              height={24}
            />
          }
          label="Recircular"
          onPress={() => onChange('RECIRCULAR')}
          position="left"
          activo={botonesActivos && !barrefondoActivo}
          isSelected={funcionActiva === 'RECIRCULAR'}
        />
      </View>
    </View>
  );
};

export default PanelFuncionesFiltro;
