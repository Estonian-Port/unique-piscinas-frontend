import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React from 'react';
import CustomPressable from '../utiles/customPressable';

type ModalEliminarEquipamiento = {
  equipamiento: string;
  visible: boolean;
  onDelete: () => void;
  onClose: () => void;
};

const ModalEliminarEquipamiento = ({
  equipamiento,
  visible,
  onDelete,
  onClose,
}: ModalEliminarEquipamiento) => {
  const deleteEquipamiento = (): void => {
    onDelete();
    onClose();
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
              Atención esta por eliminar: {equipamiento}
            </Text>
            <Text className="text-text text-sm font-geist">
              Esta acción no se puede deshacer y eliminará este equipo de la
              piscina definitavamente.
            </Text>
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
                onPress={deleteEquipamiento}
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

export default ModalEliminarEquipamiento;
