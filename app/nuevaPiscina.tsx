import { View, Text } from 'react-native';
import React, { useState } from 'react';
import InformacionBasica from '@/components/dashboard/nuevaPiscina/informacionBasica';
import ConfiguracionPiscina from '@/components/dashboard/nuevaPiscina/configuracionPiscina';
import { PiscinaNueva } from '@/data/domain/piscina';
import { router } from 'expo-router';
import BombaNuevaPiscina from '@/components/dashboard/nuevaPiscina/bombaNuevaPiscina';
import FiltroNuevaPiscina from '@/components/dashboard/nuevaPiscina/filtroNuevaPiscina';
import TratamientoNuevaPiscina from '@/components/dashboard/nuevaPiscina/tratamientoNuevaPiscina';
import CalefaccionNuevaPiscina from '@/components/dashboard/nuevaPiscina/calefaccionNuevaPiscina';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';

const piscinaNuevaInicial: PiscinaNueva = {
  id: null,
  administradorId: null,
  direccion: '',
  ciudad: '',
  codigoPlaca: '',
  notas: null,
  esDesbordante: false,
  largo: 0,
  ancho: 0,
  profundidad: 0,
  volumen: 0,
  volumenTC: 0,
  bomba: [],
  filtro: {
    id: null,
    marca: '',
    modelo: '',
    diametro: 0,
    tipo: 'Arena',
    datoExtra: 0,
    tiempoDeVidaUtil: 0,
  },
  sistemaGermicida: [],
  cloroSalino: false,
  controlAutomaticoPH: false,
  orp: false,
  calefaccion: null,
};

const NuevaPiscina = () => {
  const [step, setStep] = useState(1);
  const [nuevaPiscina, setNuevaPiscina] =
    useState<PiscinaNueva>(piscinaNuevaInicial);

  const handleCancel = () => {
    setNuevaPiscina(piscinaNuevaInicial);
    router.replace('/(tabs-adm)/dashboard');
  };

  const handleSave = async () => {
    try {
      const result = await piscinaService.create(nuevaPiscina);
      setNuevaPiscina(piscinaNuevaInicial);
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: result.message,
        position: 'bottom',
      });
      router.replace('/(tabs-adm)/dashboard');
    } catch (error: any) {
      console.error('Error al guardar la nueva piscina:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 bg-white mt-5 w-full px-6">
        <Text className="font-geist-semi-bold text-text text-3xl">
          Agregar Nueva Piscina
        </Text>
        <Text className="font-geist-light text-text text-sm mb-2">
          Complete la información para registrar una nueva piscina
        </Text>
        {step === 1 && (
          <InformacionBasica
            onCancel={handleCancel}
            onNext={() => setStep(2)}
            nuevaPiscina={nuevaPiscina}
            setNuevaPiscina={setNuevaPiscina}
          />
        )}
        {step === 2 && (
          <ConfiguracionPiscina
            onCancel={handleCancel}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
            nuevaPiscina={nuevaPiscina}
            setNuevaPiscina={setNuevaPiscina}
          />
        )}
        {step === 3 && (
          <BombaNuevaPiscina
            onCancel={handleCancel}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            nuevaPiscina={nuevaPiscina}
            setNuevaPiscina={setNuevaPiscina}
          />
        )}
        {step === 4 && (
          <FiltroNuevaPiscina
            onCancel={handleCancel}
            onBack={() => setStep(3)}
            onNext={() => setStep(5)}
            nuevaPiscina={nuevaPiscina}
            setNuevaPiscina={setNuevaPiscina}
          />
        )}
        {step === 5 && (
          <TratamientoNuevaPiscina
            onCancel={handleCancel}
            onBack={() => setStep(4)}
            onNext={() => setStep(6)}
            nuevaPiscina={nuevaPiscina}
            setNuevaPiscina={setNuevaPiscina}
          />
        )}
        {step === 6 && (
          <CalefaccionNuevaPiscina
            onCancel={handleCancel}
            onBack={() => setStep(5)}
            onSave={handleSave}
            nuevaPiscina={nuevaPiscina}
            setNuevaPiscina={setNuevaPiscina}
          />
        )}
      </View>
    </View>
  );
};

export default NuevaPiscina;