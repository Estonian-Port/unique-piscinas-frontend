import { View, Text, ScrollView, TextInput } from 'react-native';
import { Screen } from '@/components/utiles/Screen';
import { leo } from '@/data/mock/userMock';
import PrivateScreen from '@/components/utiles/privateScreen';
import CustomPressable from '@/components/utiles/customPressable';

const ChangePass = () => {
  const user = leo;

  return (
    <PrivateScreen>
      <ScrollView className="bg-white">
        <Screen>
          <Text className="font-geist-semi-bold text-2xl text-text mt-4 ml-4 mb-2 self-start">
            Cambiar contraseña
          </Text>
          <View className="w-11/12 items-center justify-between">
            <Text className="mt-4 font-geist text-text text-base">
              Ingrese su nueva contraseña
            </Text>
            <TextInput
              secureTextEntry
              className="border w-3/5 h-10 rounded-lg mt-2 px-2"
              placeholder={user.name}
            />
            <Text className="mt-4 font-geist text-text text-base">
              Repita la nueva contraseña
            </Text>
            <TextInput
              secureTextEntry
              className="border w-3/5 h-10 rounded-lg mt-2 px-2"
              placeholder={user.lastname}
            />
            <CustomPressable className="mt-10 rounded-lg bg-gray-400 p-4 w-3/5">
              <Text className="font-geist-semi-bold text-text text-lg text-center">
                Guardar cambios
              </Text>
            </CustomPressable>
          </View>
        </Screen>
      </ScrollView>
    </PrivateScreen>
  );
};

export default ChangePass;
