import React from 'react';
import { Modal, View, Text, Pressable } from 'react-native';
import { X } from 'react-native-feather';
import CustomPressable from './customPressable';

type ModalLogoutProps = {
  visible: boolean;
  message: string;
  onClose: () => void;
  onCerrarSesion: () => void;
};

const ModalLogout = ({ visible, message, onClose, onCerrarSesion }: ModalLogoutProps) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        {/* Fondo tocable */}
        <Pressable
          className="absolute inset-0 bg-black/50"
          onPress={onClose}
        />

        {/* Contenedor del modal */}
        <View className="bg-white p-6 rounded-lg w-4/5 md:w-1/3 z-10">
          {/* Cruz de cierre */}
          <Pressable
            onPress={onClose}
            className="absolute top-4 right-4 p-2 z-20"
          >
            <X color="#9ca3af" />
          </Pressable>

          <Text className="text-lg font-geist-bold text-center mb-4">
            {message}
          </Text>

          {/* Botón cerrar sesión */}
          <CustomPressable
            onPress={onCerrarSesion}
            className="bg-red-400 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-geist-semi-bold">
              Cerrar sesión
            </Text>
          </CustomPressable>
        </View>
      </View>
    </Modal>
  );
};

export default ModalLogout;
