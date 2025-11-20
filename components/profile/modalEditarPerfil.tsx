import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '@/context/authContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { UsuarioLogin } from '@/data/domain/user';
import { usuarioService } from '@/services/usuario.service';
import Toast from 'react-native-toast-message';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  apellido: Yup.string().required('El apellido es obligatorio'),
  email: Yup.string()
    .email('Email inválido')
    .required('El email es obligatorio'),
  celular: Yup.string().required('El celular es obligatorio'),
});

const ModalEditarPerfil = ({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) => {
  const { usuario, setUsuario } = useAuth();

  useEffect(() => {
    console.log('Usuario actualizado en context:', usuario);
  }, [usuario]);

  const handleActualizarPerfil = async (usuarioActualizado: UsuarioLogin) => {
    try {
      const response = await usuarioService.updatePerfil(usuarioActualizado);
      setUsuario(response.data);
      Toast.show({
        type: 'success',
        text1: 'Perfil actualizado',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al actualizar perfil',
        text2: 'Ocurrió un error al actualizar los datos de su perfil.',
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
          nombre: usuario!.nombre,
          apellido: usuario!.apellido,
          email: usuario!.email,
          celular: usuario!.celular.toString(),
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const usuarioActualizado: UsuarioLogin = {
            ...usuario!,
            nombre: values.nombre,
            apellido: values.apellido,
            email: values.email,
            celular: Number(values.celular),
          };
          handleActualizarPerfil(usuarioActualizado);
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
          dirty,
        }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                <Text className="text-xl font-geist-semi-bold text-text text-center">
                  Editar Información Personal
                </Text>
                <Text className="font-geist text-text text-sm mb-4 self-center">
                  Modifique los datos de su perfil
                </Text>
                <Text className="font-geist-semi-bold text-text text-sm mt-2">
                  Nombre
                </Text>
                <TextInput
                  className="border h-12 rounded-lg mt-2 px-2"
                  value={values.nombre}
                  placeholder="Ingrese su nombre"
                  placeholderTextColor="#9ca3af"
                  onChangeText={handleChange('nombre')}
                  onBlur={handleBlur('nombre')}
                />
                {errors.nombre && touched.nombre && (
                  <Text className="text-red-500">{errors.nombre}</Text>
                )}
                <Text className="font-geist-semi-bold text-text text-sm mt-2">
                  Apellido
                </Text>
                <TextInput
                  className="border h-12 rounded-lg mt-2 px-2"
                  value={values.apellido}
                  placeholder="Ingrese su apellido"
                  placeholderTextColor="#9CA3AF"
                  onChangeText={handleChange('apellido')}
                  onBlur={handleBlur('apellido')}
                />
                {errors.apellido && touched.apellido && (
                  <Text className="text-red-500">{errors.apellido}</Text>
                )}
                <Text className="font-geist-semi-bold text-text text-sm mt-2">
                  Email
                </Text>
                <TextInput
                  className="border h-12 rounded-lg mt-2 px-2"
                  value={values.email}
                  placeholder="Ingrese su email"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                />
                {errors.email && touched.email && (
                  <Text className="text-red-500">{errors.email}</Text>
                )}
                <Text className="font-geist-semi-bold text-text text-sm mt-2">
                  Celular
                </Text>
                <TextInput
                  className="border h-12 rounded-lg mt-2 px-2"
                  value={values.celular}
                  placeholder="Ingrese su celular"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  onChangeText={handleChange('celular')}
                  onBlur={handleBlur('celular')}
                />
                {errors.celular && touched.celular && (
                  <Text className="text-red-500">{errors.celular}</Text>
                )}
                <View className="flex-row justify-between mt-5">
                  <CustomPressable
                    onPress={onClose}
                    className="bg-gray-400 rounded-lg items-center justify-center h-12 mr-1"
                    containerClassName='w-1/2'
                  >
                    <Text className="text-text text-center font-geist-semi-bold">
                      Cancelar
                    </Text>
                  </CustomPressable>
                  <CustomPressable
                    disabled={!dirty}
                    onPress={handleSubmit as any}
                    className={`bg-purple-unique rounded-lg items-center justify-center h-12 ml-1 ${
                      !dirty ? 'opacity-50' : ''
                    }`}
                    containerClassName='w-1/2'
                  >
                    <Text className="text-white text-center font-geist-semi-bold px-1">
                      Guardar
                    </Text>
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

export default ModalEditarPerfil;
