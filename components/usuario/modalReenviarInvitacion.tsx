import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import CustomPressable from '../utiles/customPressable';

type ModalReenviarInvitacionProps = {
  visible: boolean;
  onSave: (email: string) => void;
  onClose: () => void;
  mail: string;
};

const ModalReenviarInvitacion = ({
  visible,
  onSave,
  onClose,
  mail,
}: ModalReenviarInvitacionProps) => {

  const save = async () => {
    onSave(mail);
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
              ¿Esta seguro que desea reenviar la invitación a {mail}?
            </Text>
            <Text className="text-text text-sm font-geist">
              Recuerde avisarle al usuario que revise su bandeja de spam.
            </Text>
            <View className="flex-row justify-between mt-5">
              <CustomPressable
                onPress={onClose}
                className="bg-grayish-unique rounded-lg mr-1 items-center justify-center h-12"
                containerClassName="w-1/2"
              >
                <Text className="text-text text-center font-geist-semi-bold">
                  Cancelar
                </Text>
              </CustomPressable>
              <CustomPressable
                onPress={save}
                className="bg-green-400 rounded-lg ml-1 items-center justify-center h-12"
                containerClassName="w-1/2"
              >
                <Text className="text-text text-center font-geist-semi-bold">
                  Reenviar
                </Text>
              </CustomPressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default ModalReenviarInvitacion;
