import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { entradaAgua, funcionFiltro } from '@/data/domain/piscina';
import CustomPressable from '../utiles/customPressable';

const ModalBarrefondo = ({
  visible,
  onClose,
  onSave,
  onSelected,
  funcionActiva,
  entradasActivas,
}: {
  visible: boolean;
  onClose: () => void;
  onSave: (nuevaEntrada: entradaAgua[]) => void;
  onSelected: (funcion: funcionFiltro) => void;
  funcionActiva: funcionFiltro;
  entradasActivas: entradaAgua[];
}) => {
  const handleFiltrarPress = () => {
    onSave(['Barrefondo', ...(entradasActivas || [])]);
    if (funcionActiva !== 'FILTRAR') {
      onSelected('FILTRAR');
    }
    onClose();
  };

  const handleDesagotarPress = () => {
    if (entradasActivas.includes('Skimmer')) {
      const nuevasEntradas = entradasActivas.filter((e) => e !== 'Skimmer');
      onSave(['Barrefondo', ...nuevasEntradas]);
    } else {
      onSave(['Barrefondo', ...(entradasActivas || [])]);
    }
    if (funcionActiva !== 'DESAGOTAR') {
      onSelected('DESAGOTAR');
    }
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
            <Text className="text-lg font-geist-semi-bold text-text mb-4 text-center">
              Seleccione función de filtro para Barrefondo
            </Text>

            <View className="flex-row justify-between mt-3">
              <CustomPressable
                onPress={onClose}
                className="bg-gray-400 rounded-lg mr-1 items-center justify-center h-12"
                containerClassName='w-1/3'
              >
                <Text className="text-text text-center font-geist-semi-bold">
                  Cancelar
                </Text>
              </CustomPressable>
              <CustomPressable
                onPress={handleFiltrarPress}
                className="bg-purple-unique rounded-lg mx-1 items-center justify-center h-12"
                containerClassName='w-1/3'
              >
                  <Text className="text-white text-center font-geist-semi-bold">
                    Filtrar
                  </Text>
              </CustomPressable>
              <CustomPressable
                onPress={handleDesagotarPress}
                className="bg-purple-unique rounded-lg ml-1 items-center justify-center h-12"
                containerClassName='w-1/3'
              >
                  <Text className="text-white text-center font-geist-semi-bold">
                    Desagotar
                  </Text>
              </CustomPressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalBarrefondo;
