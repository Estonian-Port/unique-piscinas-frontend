import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import React from 'react';
import CustomPressable from '../utiles/customPressable';

type ModalEliminarProgramacionProps = {
  visible: boolean;
  onClose: () => void;
  onDelete: () => void;
};

const ModalEliminarProgramacion = ({
  visible,
  onClose,
  onDelete,
}: ModalEliminarProgramacionProps) => {
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
            <Text className="text-center font-geist-semi-bold text-lg">
              ¿Estás seguro de que deseas eliminar la programación?
            </Text>

            <View className="flex-row justify-between mt-3">
              <CustomPressable
                onPress={onClose}
                className="bg-gray-400 rounded-lg items-center justify-center h-12 mr-1"
                containerClassName='w-1/2'
              >
                <Text className="text-white text-center font-geist-semi-bold">
                  Cancelar
                </Text>
              </CustomPressable>
              <CustomPressable
                onPress={onDelete}
                className="bg-red-500 rounded-lg items-center justify-center h-12 ml-1"
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

export default ModalEliminarProgramacion;
