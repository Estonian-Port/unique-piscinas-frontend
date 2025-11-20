import {
  ScrollView,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import { Screen } from '@/components/utiles/Screen';
import BombaCard from '@/components/dashboard/bombaCard';
import CalefaccionCard from '@/components/dashboard/calefaccionCard';
import GermicidaCard from '@/components/dashboard/germicidaCard';
import RegistroCard from '@/components/dashboard/registroCard';
import { ScreenCard } from '@/components/utiles/ScreenCard';
import { useEffect, useState } from 'react';
import ModalNuevoRegistro from '@/components/dashboard/modalNuevoRegistro';
import FiltroCard from '@/components/dashboard/filtroCard';
import PrivateScreen from '@/components/utiles/privateScreen';
import { PiscinaEquipos } from '@/data/domain/piscina';
import { useAuth } from '@/context/authContext';
import { administracionService } from '@/services/administracion.service';
import ModalAgregarBomba from '@/components/dashboard/modalAgregarBomba';
import ModalAgregarGermicida from '@/components/dashboard/modalAgregarIonizador';
import ModalAgregarCalefaccion from '@/components/dashboard/modalAgregarCalefaccion';
import ModalAgregarUV from '@/components/dashboard/modalAgregarUV';
import ModalAgregarIonizador from '@/components/dashboard/modalAgregarIonizador';
import ModalAgregarTrasductor from '@/components/dashboard/modalAgregarTrasductor';
import TratamientoCard from '@/components/dashboard/tratamientoCard';
import { Clipboard } from 'react-native-feather';
import Divider from '@/components/utiles/divider';
import CustomPressable from '@/components/utiles/customPressable';

export default function Equipos() {
  const [modalNuevoRegistro, setModalNuevoRegistro] = useState(false);
  const [modalAgregarCalefaccion, setModalAgregarCalefaccion] = useState(false);
  const [modalAgregarBomba, setModalAgregarBomba] = useState(false);
  const [modalAgregarUV, setModalAgregarUV] = useState(false);
  const [modalAgregarTrasductor, setModalAgregarTrasductor] = useState(false);
  const [modalAgregarIonizador, setModalAgregarIonizador] = useState(false);
  const { usuario, selectedPool } = useAuth();
  const [pool, setPool] = useState<PiscinaEquipos | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Agregar estado de loading

  const fetchPool = async () => {
    if (!selectedPool) return;

    try {
      setIsLoading(true); // Iniciar loading
      const data = await administracionService.getPiscinaEquiposById(
        usuario!.id,
        selectedPool.id
      );
      setPool(data);
    } catch (error) {
      console.error('Error fetching pool data:', error);
    } finally {
      setIsLoading(false); // Finalizar loading
    }
  };

  useEffect(() => {
    fetchPool();
  }, [selectedPool, usuario]);

  // Mostrar loading mientras carga
  if (isLoading || !selectedPool || !pool) {
    return (
      <PrivateScreen>
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-4 text-gray-600 font-geist">
            Cargando equipos...
          </Text>
        </View>
      </PrivateScreen>
    );
  }

  const sistemaGermicida = pool.sistemasGermicidas || [];
  const tieneUv = sistemaGermicida.some((s) => s.tipo === 'UV');
  const tieneIonizador = sistemaGermicida.some(
    (s) => s.tipo === 'Ionizador de cobre'
  );
  const tieneTrasductor = sistemaGermicida.some(
    (s) => s.tipo === 'Trasductor de ultrasonido'
  );

  return (
    <PrivateScreen>
      <ScrollView className="flex-1 bg-white px-4">
        <Screen>
          <Text className="self-start py-5 text-text font-geist-semi-bold text-2xl">
            Editar Equipamiento - {pool.direccion}
          </Text>
          <Text className="self-start mb-2 text-text font-geist-semi-bold text-xl">
            {pool!.bombas.length > 1 ? 'Bombas' : 'Bomba'}
          </Text>
          {pool!.bombas.map((item) => (
            <BombaCard
              key={item.id}
              piscina={pool}
              bomba={item}
              actualizarPiscina={fetchPool}
            />
          ))}
          {pool.bombas.length < 4 && (
            <CustomPressable
              className="bg-gray-200 rounded-lg p-3 items-center mb-3"
              onPress={() => setModalAgregarBomba(true)}
              containerClassName='w-1/2'
            >
              <Text className="font-geist-semi-bold text-text">
                + Agregar bomba
              </Text>
            </CustomPressable>
          )}
            <ModalAgregarBomba
              visible={modalAgregarBomba}
              onClose={() => setModalAgregarBomba(false)}
              piscina={pool}
              actualizarPiscina={fetchPool}
            />
          <Divider />
          <Text className="self-start mb-2 text-text font-geist-semi-bold text-xl">
            Filtro
          </Text>
          <FiltroCard
            filtro={pool.filtro}
            piscina={pool}
            actualizarPiscina={fetchPool}
          />
          <Divider />
          <Text className="self-start mb-2 text-text font-geist-semi-bold text-xl">
            Sistemas germicidas
          </Text>
          {pool.sistemasGermicidas.map((item) => (
            <GermicidaCard
              key={item.id}
              germicida={item}
              piscina={pool}
              actualizarPiscina={fetchPool}
            />
          ))}
          {!tieneUv && (
            <CustomPressable
              className="bg-gray-200 rounded-lg p-3 items-center mb-3"
              onPress={() => setModalAgregarUV(true)}
              containerClassName='w-1/2'
            >
              <Text className="font-geist-semi-bold text-text">
                + Agregar UV
              </Text>
            </CustomPressable>
          )}
          {modalAgregarUV && (
            <ModalAgregarUV
              visible={modalAgregarUV}
              onClose={() => setModalAgregarUV(false)}
              piscina={pool}
              actualizarPiscina={fetchPool}
            />
          )}
          {!tieneIonizador && (
            <CustomPressable
              className="bg-gray-200 rounded-lg p-3 items-center mb-3"
              onPress={() => setModalAgregarIonizador(true)}
              containerClassName='w-1/2'
            >
              <Text className="font-geist-semi-bold text-text">
                + Agregar Ionizador
              </Text>
            </CustomPressable>
          )}
          {modalAgregarIonizador && (
            <ModalAgregarIonizador
              visible={modalAgregarIonizador}
              onClose={() => setModalAgregarIonizador(false)}
              piscina={pool}
              actualizarPiscina={fetchPool}
            />
          )}
          {!tieneTrasductor && (
            <CustomPressable
              className="bg-gray-200 rounded-lg p-3 items-center mb-3"
              onPress={() => setModalAgregarTrasductor(true)}
              containerClassName='w-1/2'
            >
              <Text className="font-geist-semi-bold text-text">
                + Agregar Trasductor
              </Text>
            </CustomPressable>
          )}
          {modalAgregarTrasductor && (
            <ModalAgregarTrasductor
              visible={modalAgregarTrasductor}
              onClose={() => setModalAgregarTrasductor(false)}
              piscina={pool}
              actualizarPiscina={fetchPool}
            />
          )}
          <Divider />
          <Text className="self-start mb-2 text-text font-geist-semi-bold text-xl">
            Tratamiento
          </Text>
          <TratamientoCard
            orp={pool.orp}
            controlPH={pool.controlAutomaticoPH}
            cloroSalino={pool.cloroSalino}
            piscina={pool}
            actualizarPiscina={fetchPool}
          />
          <Divider />
          <Text className="self-start mb-2 text-text font-geist-semi-bold text-xl">
            Calefacción
          </Text>
          {pool.calefaccion ? (
            <CalefaccionCard
              calefaccion={pool.calefaccion}
              piscina={pool}
              actualizarPiscina={fetchPool}
            />
          ) : (
            <CustomPressable
              className="bg-gray-200 rounded-lg p-3 items-center mb-3"
              onPress={() => setModalAgregarCalefaccion(true)}
              containerClassName='w-1/2'
            >
              <Text className="font-geist-semi-bold text-text">
                + Agregar Calefacción
              </Text>
            </CustomPressable>
          )}
          {modalAgregarCalefaccion && (
            <ModalAgregarCalefaccion
              visible={modalAgregarCalefaccion}
              onClose={() => setModalAgregarCalefaccion(false)}
              piscina={pool}
              actualizarPiscina={fetchPool}
            />
          )}
          <Divider />
          <View className="flex-row items-center justify-between mb-4 w-full self-center">
            <Text className="text-text font-geist-semi-bold text-xl">
              Registros
            </Text>
            <CustomPressable
              onPress={() => setModalNuevoRegistro(true)}
              className="bg-white border border-grayish-unique rounded-lg py-3 px-2 flex-row items-center justify-center"
            >
              <Clipboard className="mr-2" />
              <Text className="text-black font-geist-semi-bold text-sm">
                Nuevo Registro
              </Text>
            </CustomPressable>
            {modalNuevoRegistro && (
              <ModalNuevoRegistro
                visible={modalNuevoRegistro}
                onClose={() => setModalNuevoRegistro(false)}
                actualizarPiscina={fetchPool}
                piscinaId={pool.id}
              />
            )}
          </View>
          <View className="bg-white rounded-lg mb-4 w-full">
          {pool.registros.length === 0 && (
            <View className="flex-1 justify-center items-center py-4">
              <Text className="text-gray-500 font-geist">
                No hay registros cargados.
              </Text>
            </View>
          )}
            {pool.registros.map((item) => (
              <RegistroCard
                key={item.id}
                registro={item}
                piscinaId={pool.id}
                actualizarPiscina={fetchPool}
              />
            ))}
          </View>
        </Screen>
      </ScrollView>
    </PrivateScreen>
  );
}
