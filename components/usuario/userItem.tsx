import { Pressable, View, Text } from 'react-native';
import ModalAnadirPiscina from './modalAnadirPiscina';
import { useState } from 'react';
import ModalDesvincularPiscina from './modalDesvincularPiscina';
import ModalEliminarUsuario from './modalEliminarUsuario';
import { router } from 'expo-router';
import { UsuarioRegistrado } from '@/data/domain/user';
import { useAuth } from '@/context/authContext';
import { ChevronDown, ChevronUp, Delete, Eye, Mail, MinusCircle, Phone } from 'react-native-feather';
import CustomPressable from '../utiles/customPressable';

const UserItem = ({
  usuario,
  isExpanded,
  onToggleExpand,
  onActualizarPiscinasAsignadas,
}: {
  usuario: UsuarioRegistrado;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onActualizarPiscinasAsignadas: () => void;
}) => {
  const { seleccionarPiscina } = useAuth();
  const [modalNuevaPiscina, setModalNuevaPiscina] = useState(false);
  const [modalEliminarUsuario, setModalEliminarUsuario] = useState(false);
  const [modalDesvincularPiscina, setModalDesvincularPiscina] = useState(false);

  const handlePanel = async (poolId: number) => {
    try {
      await seleccionarPiscina(poolId);
      router.push('/(tabs)/resume');
    } catch (error) {
      console.error('Error seleccionando piscina:', error);
    }
  };

  return (
    <View className="border-b border-gray-200 py-5">
      <Pressable
        className="flex-row justify-between items-center"
        onPress={onToggleExpand}
      >
        <View>
          <Text className="font-geist-semi-bold text-text text-base">
            {usuario.nombre + ' ' + usuario.apellido}
          </Text>
          <View className="flex-row gap-1 items-center">
            <Mail height={12} width={12}  />
            <Text className="font-geist text-gray-500 text-sm">{usuario.email}</Text>
          </View>
          <View className="flex-row gap-1 items-center">
            <Phone height={12} width={12}  />
            <Text className="font-geist text-gray-500 text-sm">{usuario.celular}</Text>
          </View>
        </View>
        <View className="flex-row items-center justify-between gap-3">
          <View
            className={`rounded-full px-2 py-1 ${
              usuario.estado === 'ACTIVO'
                ? 'bg-green-200 border border-green-300'
                : usuario.estado === 'INACTIVO'
                ? 'bg-yellow-100 border border-yellow-200'
                : 'bg-gray-300 border border-gray-400 '
            }`}
          >
            <Text className="font-geist-semi-bold text-text text-sm text-center">
              {usuario.estado.charAt(0).toUpperCase() +
                usuario.estado.slice(1).toLowerCase()}
            </Text>
          </View>
          <Pressable onPress={() => setModalEliminarUsuario(true)}>
            <Delete height={26} width={26}  color={'red'}/>
          </Pressable>
          {modalEliminarUsuario && (
            <ModalEliminarUsuario
              visible={modalEliminarUsuario}
              onClose={() => setModalEliminarUsuario(false)}
              idUsuario={usuario.id}
              nombreUsuario={usuario.nombre}
              apellidoUsuario={usuario.apellido}
              piscinasAsignadas={usuario.piscinasAsignadas.length > 0}
              actualizarUsuariosRegistrados={onActualizarPiscinasAsignadas}
            />
          )}
          {isExpanded ? (
            <ChevronUp height={20} width={20}  color="#333" />
          ) : (
            <ChevronDown height={20} width={20}  color="#333" />
          )}
        </View>
      </Pressable>

      {isExpanded && (
        <View>
          <View className="flex-row justify-between items-center mt-5">
            <Text className="font-geist-semi-bold text-text text-base flex-1 pr-2">
              Piscinas asignadas
            </Text>
            <CustomPressable
              className="border border-gray-300 rounded-md p-2 flex-row items-center justify-center"
              onPress={() => setModalNuevaPiscina(true)}
            >
              <Text> + Añadir Piscina</Text>
            </CustomPressable>
            {modalNuevaPiscina && (
              <ModalAnadirPiscina
                visible={modalNuevaPiscina}
                onClose={() => setModalNuevaPiscina(false)}
                idUsuario={usuario.id}
                nombreUsuario={usuario.nombre}
                apellidoUsuario={usuario.apellido}
                onActualizarPiscinasAsignadas={onActualizarPiscinasAsignadas}
              />
            )}
          </View>

          {usuario.piscinasAsignadas.length === 0 ? (
            <Text className="font-geist text-gray-500 mt-4 text-center">
              Usuario sin piscinas asignadas
            </Text>
          ) : (
            usuario.piscinasAsignadas.map((piscina) => (
              <View
                className="flex-row justify-between items-center bg-gray-200 rounded-sm mx-1 p-2 mt-3"
                key={piscina.id}
              >
                <View>
                  <Text className="font-geist-semi-bold text-text text-sm">
                    {piscina.direccion}
                  </Text>
                  <Text className="font-geist text-text text-sm">
                    {Math.round(piscina.volumen)} m³
                  </Text>
                </View>
                <View className="flex-row items-center justify-between gap-3">
                  <Pressable
                    className="justify-center items-center h-12 w-12"
                    onPress={() => handlePanel(piscina.id)}
                  >
                    <Eye height={22} width={22} />
                  </Pressable>
                  <Pressable
                    className="justify-center items-center h-12 w-12"
                    onPress={() => setModalDesvincularPiscina(true)}
                  >
                    <MinusCircle height={20} width={20}/>
                  </Pressable>
                  {modalDesvincularPiscina && (
                    <ModalDesvincularPiscina
                      piscinaSeleccionadaId={piscina.id}
                      idUsuario={usuario.id}
                      visible={modalDesvincularPiscina}
                      onClose={() => setModalDesvincularPiscina(false)}
                      onActualizarPiscinasAsignadas={onActualizarPiscinasAsignadas}
                    />
                  )}
                </View>
              </View>
            ))
          )}
        </View>
      )}
    </View>
  );
};

export default UserItem;
