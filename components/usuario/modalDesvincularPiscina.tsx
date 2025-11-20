import { administracionService } from '@/services/administracion.service';
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Toast from 'react-native-toast-message';
import CustomPressable from '../utiles/customPressable';

type ModalDesvincularPiscinaProps = {
  piscinaSeleccionadaId: number;
  idUsuario: number;
  visible: boolean;
  onClose: () => void;
  onActualizarPiscinasAsignadas: () => void;
};

const ModalDesvincularPiscina = ({
  piscinaSeleccionadaId,
  idUsuario,
  visible,
  onClose,
  onActualizarPiscinasAsignadas,
}: ModalDesvincularPiscinaProps) => {
  const save = async () => {
    try {
      await administracionService.desvincularPiscina(
        idUsuario,
        piscinaSeleccionadaId
      );
      Toast.show({
        type: 'success',
        text1: 'Piscina desvinculada',
        text2: 'La piscina ha sido desvinculada correctamente del usuario.',
        position: 'bottom',
      });
      onClose();
      onActualizarPiscinasAsignadas && onActualizarPiscinasAsignadas();
    } catch (error) {
      console.error('Error al desvincular piscina:', error);
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
              ¿Desea desvincular esta piscina de su usuario?
            </Text>
            <Text className="text-text text-sm font-geist">
              Esta acción no se puede deshacer. La piscina será desvinculada del
              usuario.
            </Text>
            <View className="flex-row justify-between mt-5">
              <CustomPressable
                onPress={onClose}
                className="bg-grayish-unique rounded-lg mr-1 items-center justify-center h-14"
                containerClassName='w-1/2'
              >
                <Text className="text-text text-center font-geist-semi-bold">
                  Cancelar
                </Text>
              </CustomPressable>
              <CustomPressable
                onPress={save}
                className="bg-red-alert rounded-lg ml-1 items-center justify-center h-14"
                containerClassName='w-1/2'
              >
                <Text className="text-white text-center font-geist-semi-bold">
                  Desvincular Piscina
                </Text>
              </CustomPressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalDesvincularPiscina;
