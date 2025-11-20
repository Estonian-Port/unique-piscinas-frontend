import { View, Text } from 'react-native';
import { useMemo } from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { MaterialIcons } from '@expo/vector-icons';
import { PiscinaResume, sistemaGermicida } from '@/data/domain/piscina';

const indicadores: {
  name: string;
  title: string;
  icon: 'bolt' | 'lightbulb-outline' | 'water' | 'thermostat';
}[] = [
  {
    name: 'UV',
    title: 'UV',
    icon: 'bolt',
  },
  {
    name: 'Ionizador',
    title: 'ION',
    icon: 'lightbulb-outline',
  },
  {
    name: 'Trasductor',
    title: 'US',
    icon: 'water',
  },
  {
    name: 'Calefaccion',
    title: 'Calentador',
    icon: 'thermostat',
  },
];

const Indicadores = ({ piscina }: { piscina: PiscinaResume }) => {
  
  const estadoIndicador = (indicador: string) => {
    if (indicador === 'Calefaccion') {
      if (piscina.calefaccion === null) return 'no-existe';
      if (piscina.calefaccion.activa) return 'encendido';
      return 'apagado';
    }

    if (indicador === 'UV') {
      const germicida = piscina.sistemasGermicidas.find(
        (g) => g.tipo === 'UV'
      );
      if (!germicida) return 'no-existe';
      if (germicida.activo) return 'encendido';
      return 'apagado';
    }

    if (indicador === 'Ionizador') {
      const germicida = piscina.sistemasGermicidas.find(
        (g) => g.tipo === 'Ionizador de cobre'
      );
      if (!germicida) return 'no-existe';
      if (germicida.activo) return 'encendido';
      return 'apagado';
    }

    if (indicador === 'Trasductor') {
      const germicida = piscina.sistemasGermicidas.find(
        (g) => g.tipo === 'Trasductor de ultrasonido'
      );
      if (!germicida) return 'no-existe';
      if (germicida.activo) return 'encendido';
      return 'apagado';
    }
  };

  return (
    <ScreenCard>
      <View className="flex-row justify-between items-center">
        {indicadores.map((indicador, index) => {
          const estado = estadoIndicador(indicador.name);
          let borderColor = 'border-grayish-unique';
          let bgColor = 'bg-white';
          let iconColor = 'black';
          let iconOpacity = 1;
          let textColor = '';
          if (estado === 'encendido') {
            borderColor = 'border-green-500';
            bgColor = 'bg-green-100';
            iconColor = 'green';
            textColor = 'text-green-600';
          } else if (estado === 'no-existe') {
            iconColor = '#A3A3A3'; // gris
            iconOpacity = 0.4;
          }
          return (
            <View key={index} className="flex-1 items-center">
              <View
                className={`border p-3 rounded-full items-center ${borderColor} ${bgColor}`}
              >
                <MaterialIcons
                  name={indicador.icon}
                  size={32}
                  color={iconColor}
                  style={{ opacity: iconOpacity }}
                />
              </View>
              <Text
                className={`font-geist-semi-bold text-base mt-1 ${textColor}`}
                style={
                  estado === 'no-existe'
                    ? { opacity: 0.4, color: '#A3A3A3' }
                    : {}
                }
              >
                {indicador.title}
              </Text>
            </View>
          );
        })}
      </View>
    </ScreenCard>
  );
};

export default Indicadores;
