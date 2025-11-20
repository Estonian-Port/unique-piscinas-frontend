import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import Toast from 'react-native-toast-message';
import { usuarioService } from '@/services/usuario.service';
import { useAuth } from '@/context/authContext';
import { AlertCircle } from 'react-native-feather';
import CustomPressable from '../utiles/customPressable';

type ModalEliminarUsuarioProps = {
  visible: boolean;
  onClose: () => void;
  idUsuario: number;
  nombreUsuario: string;
  apellidoUsuario: string;
  piscinasAsignadas: boolean;
  actualizarUsuariosRegistrados: () => void;
};

const ModalEliminarUsuario = ({
  visible,
  onClose,
  idUsuario,
  nombreUsuario,
  apellidoUsuario,
  piscinasAsignadas,
  actualizarUsuariosRegistrados,
}: ModalEliminarUsuarioProps) => {
  const { usuario } = useAuth();

  const save = async () => {
    try {
      await usuarioService.eliminar(idUsuario, usuario!.id);
      Toast.show({
        type: 'success',
        text1: 'Usuario eliminado',
        text2: 'El usuario ha sido eliminado correctamente.',
        position: 'bottom',
      });
      onClose();
      actualizarUsuariosRegistrados && actualizarUsuariosRegistrados();
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
            <Text className="text-text text-xl font-geist-bold mb-2 text-center">
              ¿Esta seguro que quiere eliminar a{' '}
              {nombreUsuario + ' ' + apellidoUsuario}?
            </Text>
            <Text className="text-text text-sm font-geist">
              Esta acción no se puede deshacer y eliminará al usuario.
            </Text>
            {piscinasAsignadas && (
              <View className="bg-yellow-200 border-l-4 border-yellow-600 p-3 my-4 rounded-md flex-row items-center">
                <Text className="text-yellow-800 font-geist-semi-bold">
                  ATENCIÓN: Este usuario tiene piscinas asignadas. Si lo
                  elimina, estas piscinas quedarán sin un administrador
                  asignado.
                </Text>
              </View>
            )}
            <View className="flex-row justify-between mt-5">
              <CustomPressable
                onPress={onClose}
                className="bg-grayish-unique rounded-lg mr-1 items-center justify-center h-12"
                containerClassName='w-1/2'
              >
                <Text className="text-text text-center font-geist-semi-bold">
                  Cancelar
                </Text>
              </CustomPressable>
              <CustomPressable
                onPress={save}
                className="bg-red-alert rounded-lg ml-1 items-center justify-center h-12"
                containerClassName='w-1/2'
              >
                  <Text className="text-white text-center font-geist-semi-bold">
                    Eliminar
                  </Text>
              </CustomPressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalEliminarUsuario;
