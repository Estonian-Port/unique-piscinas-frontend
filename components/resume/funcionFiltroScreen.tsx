import { View, Text } from 'react-native';
import PanelFuncionesFiltro from './funcionFiltro';
import { funcionFiltro, PiscinaResume } from '@/data/domain/piscina';
import { SafeAreaView } from 'react-native-safe-area-context';

const FuncionFiltroScreen = ({
  piscina,
  entradaDeAguaActiva,
  skimmer,
  barrefondo,
  handleFuncionFiltroChange,
  resetearSistema,
}: {
  piscina: PiscinaResume;
  entradaDeAguaActiva: boolean;
  skimmer: boolean;
  barrefondo: boolean;
  handleFuncionFiltroChange: (funcion: funcionFiltro) => void;
  resetearSistema: () => void;
}) => {

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        <Text className="text-2xl mb-8 text-text font-geist-semi-bold">
          Función del Filtro
        </Text>

        <PanelFuncionesFiltro
          botonesActivos={entradaDeAguaActiva}
          onChange={handleFuncionFiltroChange}
          funcionActiva={piscina.funcionActiva}
          opacidad={!entradaDeAguaActiva ? 0.4 : 1}
          skimmerActivo={skimmer}
          barrefondoActivo={barrefondo}
          onReset={resetearSistema}
        />
      </View>
    </SafeAreaView>
  );
};

export default FuncionFiltroScreen;
