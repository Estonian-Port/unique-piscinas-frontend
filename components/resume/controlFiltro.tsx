import { View, Text, Pressable } from 'react-native';
import React, {
  useEffect,
  useState,
  Dispatch,
  SetStateAction,
  useRef,
} from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import FuncionFiltroScreen from './funcionFiltroScreen';
import type {
  entradaAgua,
  funcionFiltro,
  PiscinaResume,
} from '@/data/domain/piscina';
import ModalBarrefondo from './modalBarrefondo';
import Toast from 'react-native-toast-message';
import { Box, Circle, Droplet, Eye, Info } from 'react-native-feather';
import { estadoPiscinaService } from '@/services/estadoPiscina.service';

interface ControlFiltroProps {
  piscina: PiscinaResume;
  entradaAgua: entradaAgua[];
  funcionFiltro: funcionFiltro | null;
  setPiscina: Dispatch<SetStateAction<PiscinaResume | null>>;
  onUpdate?: () => Promise<void> | void;
}

export default function ControlFiltro({
  piscina,
  setPiscina,
  onUpdate,
}: ControlFiltroProps) {
  const [modalBarrefondoVisible, setModalBarrefondoVisible] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Función helper para verificar si hay entradas de agua
  const hayEntradaDeAguaSeleccionada =
    piscina.entradaAgua && piscina.entradaAgua.length > 0;

  useEffect(() => {
    if (hayEntradaDeAguaSeleccionada && piscina.funcionActiva === 'REPOSO') {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      timeoutRef.current = setTimeout(() => {
        if (piscina.funcionActiva === 'REPOSO') {
          handleReset();
          Toast.show({
            type: 'info',
            text1: 'Sistema reseteado',
            text2: 'No se seleccionó una función de filtro en 30 segundos.',
            position: 'bottom',
          });
        }
      }, 30000);
    } else {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [hayEntradaDeAguaSeleccionada, piscina.funcionActiva]);

  const actualizarEntradaDeAgua = async (entradasActivas: entradaAgua[]) => {
    try {
      const response = await estadoPiscinaService.actualizarEntradaDeAgua(
        piscina.id,
        entradasActivas
      );

      await verificarFuncionFiltro(response.data.entradaAgua);

      await onUpdate?.();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar la entrada de agua.',
        position: 'bottom',
      });
    }
  };

  const actualizarFuncionFiltro = async (funcion: funcionFiltro) => {
    try {
      if (funcion === piscina.funcionActiva) {
        // Desactivar función actual
        await estadoPiscinaService.actualizarFuncionFiltro(
          piscina.id,
          'REPOSO'
        );

        // Esperar a que se actualice la entrada de agua
        await actualizarEntradaDeAgua([]);
      } else {
        // Activar nueva función
        await estadoPiscinaService.actualizarFuncionFiltro(piscina.id, funcion);
      }

      // Siempre refrescar después de cambiar función
      // Esto asegura que los sistemas germicidas se actualicen
      await onUpdate?.();
    } catch (error) {
      console.error(error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo actualizar la función del filtro.',
        position: 'bottom',
      });
    }
  };

  const verificarFuncionFiltro = async (entradas: entradaAgua[]) => {
    if (!entradas || entradas.length === 0) {
      try {
        await estadoPiscinaService.actualizarFuncionFiltro(
          piscina.id,
          'REPOSO'
        );
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'No se pudo actualizar la función del filtro.',
          position: 'bottom',
        });
      }
    }
  };

  const handleTanquePress = () => {
    const isTanqueActivo = piscina.entradaAgua?.includes('Tanque');
    if (!isTanqueActivo) {
      actualizarEntradaDeAgua(['Tanque', ...(piscina.entradaAgua || [])]);
    } else {
      const nuevasEntradas = (piscina.entradaAgua || []).filter(
        (e) => e !== 'Tanque'
      );
      actualizarEntradaDeAgua(nuevasEntradas);
    }
  };

  const handleSkimmerPress = () => {
    const isSkimmerActivo = piscina.entradaAgua?.includes('Skimmer');
    if (!isSkimmerActivo) {
      actualizarEntradaDeAgua(['Skimmer', ...(piscina.entradaAgua || [])]);
      if (piscina.funcionActiva === 'DESAGOTAR') {
        actualizarFuncionFiltro('REPOSO');
      }
    } else {
      const nuevasEntradas = (piscina.entradaAgua || []).filter(
        (e) => e !== 'Skimmer'
      );
      actualizarEntradaDeAgua(nuevasEntradas);
    }
  };

  const handleFondoPress = () => {
    const isFondoActivo = piscina.entradaAgua?.includes('Fondo');
    if (!isFondoActivo) {
      actualizarEntradaDeAgua(['Fondo', ...(piscina.entradaAgua || [])]);
    } else {
      const nuevasEntradas = (piscina.entradaAgua || []).filter(
        (e) => e !== 'Fondo'
      );
      actualizarEntradaDeAgua(nuevasEntradas);
    }
  };

  const handleBarrefondoPress = () => {
    const isBarrefondoActivo = piscina.entradaAgua?.includes('Barrefondo');
    if (!isBarrefondoActivo) {
      setModalBarrefondoVisible(true);
    } else {
      const nuevasEntradas = (piscina.entradaAgua || []).filter(
        (e) => e !== 'Barrefondo'
      );
      actualizarEntradaDeAgua(nuevasEntradas);
    }
  };

  const handleReset = async () => {
    try {
      if (piscina.funcionActiva !== 'REPOSO') {
        await estadoPiscinaService.actualizarFuncionFiltro(
          piscina.id,
          'REPOSO'
        );
      }
      if (piscina.entradaAgua && piscina.entradaAgua.length > 0) {
        await estadoPiscinaService.actualizarEntradaDeAgua(piscina.id, []);
      }

      await onUpdate?.();
    } catch (error) {
      console.error('Error al resetear:', error);
    }
  };

  // Variables derivadas del estado de piscina
  const isFondoActivo = piscina.entradaAgua?.includes('Fondo');
  const isBarrefondoActivo = piscina.entradaAgua?.includes('Barrefondo');
  const isSkimmerActivo = piscina.entradaAgua?.includes('Skimmer');
  const isTanqueActivo = piscina.entradaAgua?.includes('Tanque');

  return (
    <ScreenCard>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="font-geist-semi-bold text-3xl text-text">
          Control de Filtro
        </Text>

        {piscina.funcionActiva != 'REPOSO' ? (
          <View className="bg-green-200 rounded-full p-2 border border-green-300">
            <Text className="font-geist-semi-bold text-sm text-text">
              Activado
            </Text>
          </View>
        ) : (
          <View className="bg-yellow-100 rounded-full p-2 border border-yellow-200">
            <Text className="font-geist-semi-bold text-sm text-text">
              Desactivado
            </Text>
          </View>
        )}
      </View>

      {/*ENTRADAS DE AGUA */}
      <Text className="text-2xl mb-2 text-text font-geist-semi-bold">
        Entradas de Agua
      </Text>
      <View className="flex-row justify-between gap-2">
        <Pressable
          className={`rounded-md items-center p-2 flex-1 ${
            isFondoActivo
              ? 'border-2 border-blue-500 bg-blue-100'
              : 'border border-grayish-unique'
          }`}
          onPress={handleFondoPress}
        >
          <Droplet />
          <Text className="font-geist-semi-bold text-base text-text mt-2">
            Fondo
          </Text>
        </Pressable>

        <Pressable
          className={`rounded-md items-center p-2 flex-1 ${
            isBarrefondoActivo
              ? 'border-2 border-blue-500 bg-blue-100'
              : 'border border-grayish-unique'
          }`}
          onPress={handleBarrefondoPress}
        >
          <Circle />
          <Text className="font-geist-semi-bold text-base text-text mt-2">
            Barrefondo
          </Text>
        </Pressable>

        <ModalBarrefondo
          visible={modalBarrefondoVisible}
          onClose={() => setModalBarrefondoVisible(false)}
          onConfirm={async (
            nuevaEntrada: entradaAgua[],
            funcion: funcionFiltro
          ) => {
            await actualizarEntradaDeAgua(nuevaEntrada);
            if (funcion !== piscina.funcionActiva) {
              await estadoPiscinaService.actualizarFuncionFiltro(
                piscina.id,
                funcion
              );
              await onUpdate?.();
            }
            setModalBarrefondoVisible(false);
          }}
          entradasActivas={piscina.entradaAgua || []}
        />

        {piscina.esDesbordante ? (
          <Pressable
            className={`rounded-md items-center p-2 flex-1 ${
              isTanqueActivo
                ? 'border-2 border-blue-500 bg-blue-100'
                : 'border border-grayish-unique'
            }`}
            onPress={handleTanquePress}
          >
            <Box />
            <Text className="font-geist-semi-bold text-base text-text mt-2">
              Tanque
            </Text>
          </Pressable>
        ) : (
          <Pressable
            className={`rounded-md items-center p-2 flex-1 ${
              isSkimmerActivo
                ? 'border-2 border-blue-500 bg-blue-100'
                : 'border border-grayish-unique'
            } ${piscina.funcionActiva === 'DESAGOTAR' && 'opacity-50'}`}
            onPress={handleSkimmerPress}
            disabled={piscina.funcionActiva === 'DESAGOTAR'}
          >
            <Eye />
            <Text className="font-geist-semi-bold text-base text-text mt-2">
              Skimmer
            </Text>
          </Pressable>
        )}
      </View>

      {/*MENSAJE DE ADVERTENCIA */}
      {!hayEntradaDeAguaSeleccionada && (
        <View className="flex-row items-start bg-yellow-50 border-l-4 border-yellow-400 rounded-md shadow-sm p-4 mt-4 mx-1">
          <View className="mt-0.5">
            <Info color="#b45309" />
          </View>
          <Text className="flex-1 font-geist-semi-bold text-base text-yellow-900 ml-3">
            Seleccione al menos una entrada de agua para activar el sistema de
            filtrado.
          </Text>
        </View>
      )}

      <View className="bg-gray-200 h-px mt-5 w-full" />

      {/*MODO DE FILTRO */}
      <FuncionFiltroScreen
        piscina={piscina}
        entradaDeAguaActiva={hayEntradaDeAguaSeleccionada}
        skimmer={isSkimmerActivo}
        barrefondo={isBarrefondoActivo}
        handleFuncionFiltroChange={actualizarFuncionFiltro}
        resetearSistema={handleReset}
      />
    </ScreenCard>
  );
}
