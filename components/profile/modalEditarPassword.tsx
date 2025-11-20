import React, { useEffect, useState } from 'react';
import {View,Text,Pressable,TextInput,Modal,KeyboardAvoidingView, Platform,} from 'react-native';
import { useAuth } from '@/context/authContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UsuarioCambioPassword, UsuarioLogin } from '@/data/domain/user';
import { usuarioService } from '@/services/usuario.service';
import Toast from 'react-native-toast-message';
import { Eye, EyeOff } from 'react-native-feather';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  passwordActual: Yup.string().required('La contraseña actual es obligatoria'),
  nuevoPassword: Yup.string()
    .required('La nueva contraseña es obligatoria')
    .min(6, 'La nueva contraseña debe tener al menos 6 caracteres'),
  confirmacionPassword: Yup.string()
    .oneOf(
      [Yup.ref('nuevoPassword'), undefined],
      'Las contraseñas deben coincidir'
    )
    .required('La confirmación de la contraseña es obligatoria'), 
});

const ModalEditarPassword = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { usuario, setUsuario } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const handleActualizarPassword = async (
    usuarioActualizado: UsuarioCambioPassword
  ) => {
    try {
      const response = await usuarioService.updatePassword(usuarioActualizado);
      Toast.show({
        type: 'success',
        text1: 'Password actualizado',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar password',
        text2: 'Ocurrió un error al actualizar los datos de su password.',
        position: 'bottom',
      });
    }
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Formik
        initialValues={{
          passwordActual: '',
          nuevoPassword: '',
          confirmacionPassword: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const usuarioActualizado: UsuarioCambioPassword = {
            email: usuario!.email,
            passwordActual: values.passwordActual,
            nuevoPassword: values.nuevoPassword,
            confirmacionPassword: values.confirmacionPassword,
          };
          handleActualizarPassword(usuarioActualizado);
          onClose();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          errors,
          touched,
          values,
        }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                <Text className="text-xl font-geist-semi-bold text-text text-center">
                  Cambiar Password
                </Text>
                <Text className="font-geist text-text text-sm mb-2 self-center">
                  Modifique su contraseña
                </Text>
                <Text className="font-geist-semi-bold text-text text-sm mt-2">
                  Password actual
                </Text>
                <View className="relative">
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.passwordActual}
                    onChangeText={handleChange('passwordActual')}
                    onBlur={handleBlur('passwordActual')}
                    placeholder="Ingrese su contraseña actual"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff width={20} height={20} />
                    ) : (
                      <Eye width={20} height={20} />
                    )}
                  </Pressable>
                </View>
                {errors.passwordActual && touched.passwordActual && (
                  <Text className="text-red-500">{errors.passwordActual}</Text>
                )}
                <Text className="font-geist-semi-bold text-text text-sm mt-5">
                  Nueva Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.nuevoPassword}
                    onChangeText={handleChange('nuevoPassword')}
                    onBlur={handleBlur('nuevoPassword')}
                    placeholder="Ingrese su nueva contraseña"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff width={20} height={20} />
                    ) : (
                      <Eye width={20} height={20} />
                    )}
                  </Pressable>
                </View>
                {touched.nuevoPassword && errors.nuevoPassword && (
                  <Text className="text-red-500 mt-2">
                    {errors.nuevoPassword}
                  </Text>
                )}

                <Text className="font-geist-semi-bold text-text text-sm mt-5">
                  Reingrese su password
                </Text>
                <View className="relative">
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.confirmacionPassword}
                    onChangeText={handleChange('confirmacionPassword')}
                    onBlur={handleBlur('confirmacionPassword')}
                    placeholder="Reingrese su nueva contraseña"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                  />
                  <Pressable
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff width={20} height={20} />
                    ) : (
                      <Eye width={20} height={20} />
                    )}
                  </Pressable>
                </View>
                {touched.confirmacionPassword &&
                  errors.confirmacionPassword && (
                    <Text className="text-red-500 mt-2">
                      {errors.confirmacionPassword}
                    </Text>
                  )}
                <View className="flex-row justify-between mt-5">
                  <CustomPressable
                    onPress={onClose}
                    className="bg-gray-400 rounded-lg items-center justify-center h-14 mr-1"
                    containerClassName='w-1/2'
                  >
                    <Text className="text-text text-center font-geist-semi-bold">
                      Cancelar
                    </Text>
                  </CustomPressable>
                  <CustomPressable
                    onPress={handleSubmit as any}
                    className="bg-purple-unique rounded-lg items-center justify-center h-14 ml-1"
                    containerClassName='w-1/2'
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-white text-center font-geist-semi-bold px-1">
                        Cambiar Password
                      </Text>
                    </View>
                  </CustomPressable>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        )}
      </Formik>
    </Modal>
  );
};

export default ModalEditarPassword;
