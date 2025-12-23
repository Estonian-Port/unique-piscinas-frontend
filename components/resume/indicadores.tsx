import { View, Text } from 'react-native';
import { useMemo } from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { Zap, Lightbulb, Waves, ThermometerSun } from 'lucide-react-native';
import { PiscinaResume } from '@/data/domain/piscina';

// Cambia el tipo del icon a ser el componente de Lucide
const indicadores: {
  name: string;
  title: string;
  icon: typeof Zap | typeof Lightbulb | typeof Waves | typeof ThermometerSun;
}[] = [
  {
    name: 'UV',
    title: 'UV',
    icon: Zap,
  },
  {
    name: 'Ionizador',
    title: 'ION',
    icon: Lightbulb,
  },
  {
    name: 'Trasductor',
    title: 'US',
    icon: Waves,
  },
  {
    name: 'Calefaccion',
    title: 'Calentador',
    icon: ThermometerSun,
  },
];

const Indicadores = ({ piscina }: { piscina: PiscinaResume }) => {
  const estadosIndicadores = useMemo(() => {
    const estadoIndicador = (
      indicador: string
    ): 'encendido' | 'apagado' | 'no-existe' => {
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

      return 'no-existe';
    };

    return indicadores.map((ind) => ({
      ...ind,
      estado: estadoIndicador(ind.name),
    }));
  }, [piscina.sistemasGermicidas, piscina.calefaccion, piscina.funcionActiva]);

  return (
    <ScreenCard>
      <View className="flex-row justify-between items-center">
        {estadosIndicadores.map((indicador, index) => {
          const estado = indicador.estado;
          let borderColor = 'border-grayish-unique';
          let bgColor = 'bg-white';
          let iconColor = 'black';
          let iconOpacity = 1;
          let textColor = '';

          if (estado === 'encendido') {
            borderColor = 'border-green-500';
            bgColor = 'bg-green-100';
            iconColor = '#22c55e'; // green-500 en hex
            textColor = 'text-green-600';
          } else if (estado === 'no-existe') {
            iconColor = '#A3A3A3';
            iconOpacity = 0.4;
          }

          // Asigna el componente del icono a una variable
          const IconComponent = indicador.icon;

          return (
            <View key={index} className="flex-1 items-center">
              <View
                className={`border p-3 rounded-full items-center ${borderColor} ${bgColor}`}
              >
                <View style={{ opacity: iconOpacity }}>
                  <IconComponent width={24} height={24} color={iconColor} />
                </View>
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
