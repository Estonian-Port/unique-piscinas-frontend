import { View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';
import { usuarioService } from '@/services/usuario.service';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'react-native-feather';
import CustomPressable from '@/components/utiles/customPressable';

export interface UsuarioAlta {
  id: number;
  nombre: string;
  apellido: string;
  celular: number;
  nuevoPassword: string;
  confirmacionPassword: string;
}

const usuarioAltaInicial: UsuarioAlta = {
  id: 0,
  nombre: '',
  apellido: '',
  celular: 0,
  nuevoPassword: '',
  confirmacionPassword: '',
};

const validationSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es obligatorio'),
  apellido: Yup.string().required('El apellido es obligatorio'),
  celular: Yup.number()
    .required('El celular es obligatorio')
    .typeError('El celular debe ser un número'),
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

const Registro = () => {
  const { usuario, setUsuario } = useAuth();
  const formikRef = useRef<any>(null);
  const [usuarioAlta, setUsuarioAlta] =
    useState<UsuarioAlta>(usuarioAltaInicial);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!usuario) {
      router.replace('/login');
    }
  }, [usuario]);

  if (!usuario) return null;

  const handleSave = async (usuarioRegistro: UsuarioAlta) => {
    try {
      const result = await usuarioService.registro(usuarioRegistro);
      setUsuario(result.data);
      setUsuarioAlta(usuarioAltaInicial);
      Toast.show({
        type: 'success',
        text1: 'Éxito',
        text2: result.message,
        position: 'bottom',
      });
      router.replace('/pools');
    } catch (error: any) {
      console.error('Error en el registro, comuniquese con soporte', error);
    }
  };

  const getInitialValues = () => {
    return {
      nombre: usuarioAlta.nombre ?? '',
      apellido: usuarioAlta.apellido ?? '',
      celular: usuarioAlta.celular.toString() ?? '',
      nuevoPassword: usuarioAlta.nuevoPassword ?? '',
      confirmacionPassword: usuarioAlta.confirmacionPassword ?? '',
    };
  };

  const initialValues = getInitialValues();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values) => {
          const usuarioModificado = {
            ...usuarioAlta,
            id: usuario.id,
            nombre: values.nombre,
            apellido: values.apellido,
            celular: Number(values.celular),
            nuevoPassword: values.nuevoPassword,
            confirmacionPassword: values.confirmacionPassword,
          };

          await handleSave(usuarioModificado);
        }}
        enableReinitialize={false}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
        }) => (
          <ScrollView 
            className="bg-white"
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="flex-1 items-center justify-center p-4">
              <Text className="font-geist-semi-bold text-2xl text-text mb-2 self-center">
                Bienvenido a Unique
              </Text>
              <Text className="font-geist text-sm text-text mb-4">
                Por única vez te pediremos que completes tus datos personales y
                cambies tu contraseña por cuestiones de seguridad.
              </Text>
              <View className="justify-between w-full px-5">
                <Text className="font-geist-semi-bold text-text text-sm mt-5">
                  Nombre
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.nombre}
                  onChangeText={handleChange('nombre')}
                  onBlur={handleBlur('nombre')}
                  placeholder="Ingrese su nombre"
                  placeholderTextColor="#9CA3AF"
                />
                {touched.nombre && errors.nombre && (
                  <Text className="text-red-500 mt-2">{errors.nombre}</Text>
                )}

                <Text className="font-geist-semi-bold text-text text-sm mt-5">
                  Apellido
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.apellido}
                  onChangeText={handleChange('apellido')}
                  onBlur={handleBlur('apellido')}
                  placeholder="Ingrese su apellido"
                  placeholderTextColor="#9CA3AF"
                />
                {touched.apellido && errors.apellido && (
                  <Text className="text-red-500 mt-2">{errors.apellido}</Text>
                )}

                <Text className="font-geist-semi-bold text-text text-sm mt-5">
                  Celular
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.celular === '0' ? '' : values.celular}
                  onChangeText={handleChange('celular')}
                  onBlur={handleBlur('celular')}
                  placeholder="Ingrese su celular"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                />
                {touched.celular && errors.celular && (
                  <Text className="text-red-500 mt-2">{errors.celular}</Text>
                )}

                <Text className="font-geist-semi-bold text-text text-sm mt-5">
                  Password
                </Text>
                <View className="relative">
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.nuevoPassword}
                    onChangeText={handleChange('nuevoPassword')}
                    onBlur={handleBlur('nuevoPassword')}
                    placeholder="Ingrese su nueva contraseña"
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
                {touched.confirmacionPassword && errors.confirmacionPassword && (
                  <Text className="text-red-500 mt-2">
                    {errors.confirmacionPassword}
                  </Text>
                )}

                <CustomPressable
                  className="mt-6 mb-8 rounded-lg bg-gray-400 p-4 w-3/5 self-center"
                  onPress={handleSubmit as any}
                >
                  <Text className="font-geist-semi-bold text-text text-lg text-center">
                    Guardar cambios
                  </Text>
                </CustomPressable>
              </View>
            </View>
          </ScrollView>
        )}
      </Formik>
    </KeyboardAvoidingView>
  );
};

export default Registro;