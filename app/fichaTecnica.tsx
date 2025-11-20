import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { Screen } from '@/components/utiles/Screen';
import { PiscinaFichaTecnica } from '@/data/domain/piscina';
import { useEffect, useState } from 'react';
import ModalEditarInfoGeneral from '@/components/dashboard/modalEditarInfoGeneral';
import ModalEditarDimensiones from '@/components/dashboard/modalEditarDimensiones';
import ModalEditarNotas from '@/components/dashboard/modalEditarNotas';
import PrivateScreen from '@/components/utiles/privateScreen';
import { useAuth } from '@/context/authContext';
import { administracionService } from '@/services/administracion.service';
import { Edit2 } from 'react-native-feather';

export default function FichaTecnica() {
  const { usuario, selectedPool } = useAuth();
  const [pool, setPool] = useState<PiscinaFichaTecnica | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Agregar estado de loading
  const [modalEditInfo, setModalEditInfo] = useState(false);
  const [modalEditDimension, setModalEditDimension] = useState(false);
  const [modalEditNotas, setModalEditNotas] = useState(false);

  useEffect(() => {
    const fetchPool = async () => {
      if (!selectedPool) return; // Validar que existe selectedPool
      
      try {
        setIsLoading(true); // Iniciar loading
        const data = await administracionService.getPiscinaFichaTecnicaById(usuario!.id, selectedPool.id);
        setPool(data);
      } catch (error) {
        console.error('Error fetching pool data:', error);
      } finally {
        setIsLoading(false); // Finalizar loading
      }
    };

    fetchPool();
  }, [selectedPool, usuario]);

  const handleEdit = (poolEditada: PiscinaFichaTecnica) => {
    setPool(poolEditada); // Actualizar el pool editado
  };

  // Mostrar loading mientras carga
  if (isLoading || !selectedPool || !pool) {
    return (
      <PrivateScreen>
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#000" />
          <Text className="mt-4 text-gray-600 font-geist">Cargando ficha técnica...</Text>
        </View>
      </PrivateScreen>
    );
  }

  const InfoRow = ({
    label,
    value,
    isLast = false,
  }: {
    label: string;
    value: string;
    isLast?: boolean;
  }) => (
    <View className={`py-3 px-4 ${!isLast ? 'border-b border-gray-100' : ''}`}>
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-600 font-geist text-sm flex-1">{label}</Text>
        <Text className="font-geist-semi-bold text-gray-900 text-sm flex-1 text-right">
          {value}
        </Text>
      </View>
    </View>
  );

  const SectionCard = ({
    title,
    children,
    action,
  }: {
    title: string;
    children: React.ReactNode;
    action: () => void;
  }) => (
    <View className="bg-white rounded-xl shadow-sm border border-gray-100 mb-4">
      <View className="flex-row justify-between px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-xl">
        <Text className="font-geist-semi-bold text-gray-800 text-base">
          {title}
        </Text>
        <Pressable onPress={action}>
          <Edit2/>
        </Pressable>
      </View>
      {children}
    </View>
  );

  return (
    <PrivateScreen>
      <ScrollView className="flex-1 bg-gray-50">
        <Screen>
          <View className="p-5 w-11/12">
            {/* Header */}
            <View className="mb-4">
              <Text className="font-geist-semi-bold text-text text-lg">
                Ficha Técnica
              </Text>
            </View>

            {/* Información General - Ahora pool está garantizado que no es null */}
            <SectionCard
              title="Información General"
              action={() => setModalEditInfo(true)}
            >
              <InfoRow label="Dirección" value={pool.direccion} />
              <InfoRow label="Ciudad" value={pool.ciudad} />
              <InfoRow label="Código placa" value={pool.codigoPlaca.toString()} />
              <InfoRow
                label="Administrador"
                value={
                  pool.nombreAdministrador != null
                    ? pool.nombreAdministrador
                    : 'No asignado'
                }
                isLast
              />
            </SectionCard>
            {modalEditInfo && (
              <ModalEditarInfoGeneral
                visible={modalEditInfo}
                onClose={() => setModalEditInfo(false)}
                onSave={handleEdit}
                pool={pool}
              />
            )}

            {/* Dimensiones */}
            <SectionCard
              title="Dimensiones y Capacidad"
              action={() => setModalEditDimension(true)}
            >
              <InfoRow
                label="Tipo de Piscina"
                value={pool.esDesbordante ? 'Infinity' : 'Skimmer'}
              />
              <InfoRow label="Largo" value={`${pool.largo} m`} />
              <InfoRow label="Ancho" value={`${pool.ancho} m`} />
              <InfoRow label="Profundidad" value={`${pool.profundidad} m`} />
              <InfoRow
                label="Volumen"
                value={`${pool.volumen} m³`}
                isLast={!pool.esDesbordante}
              />
              {pool.esDesbordante && (
                <InfoRow
                  label="Volumen T.C."
                  value={`${pool.volumenTC} m³`}
                  isLast
                />
              )}
            </SectionCard>
            {modalEditDimension && (
              <ModalEditarDimensiones
                visible={modalEditDimension}
                onClose={() => setModalEditDimension(false)}
                onSave={handleEdit}
                pool={pool}
              />
            )}

            {/* Notas */}
            <SectionCard
              title="Notas Adicionales"
              action={() => setModalEditNotas(true)}
            >
              <View className="p-4">
                <Text className="font-geist text-gray-700 text-sm leading-5">
                  {pool.notas != null && pool.notas !== ''
                    ? pool.notas
                    : 'No hay notas adicionales.'}
                </Text>
              </View>
            </SectionCard>
            {modalEditNotas && (
              <ModalEditarNotas
                visible={modalEditNotas}
                onClose={() => setModalEditNotas(false)}
                onSave={handleEdit}
                pool={pool}
              />
            )}
          </View>
        </Screen>
      </ScrollView>
    </PrivateScreen>
  );
}
