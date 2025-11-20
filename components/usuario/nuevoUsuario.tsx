import { View, Text, TextInput } from 'react-native';
import React, { useRef, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ScreenCard } from '../utiles/ScreenCard';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NuevoUsuario } from '@/data/domain/user';
import { usuarioService } from '@/services/usuario.service';
import Toast from 'react-native-toast-message';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('El correo electrónico es inválido')
    .required('El correo electrónico es obligatorio'),
});

const usuarioVacio: NuevoUsuario = {
  email: '',
};

const NuevoUsuarioForm = ({ onCreated }: { onCreated: () => void }) => {
  const formikRef = useRef<any>(null);

  useFocusEffect(
    useCallback(() => {
      // Verificamos que la referencia exista antes de usarla
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    }, [])
  );

  const crearUsuario = async (usuario: NuevoUsuario, formikActions: any) => {
    try {
      formikActions.setSubmitting(true);

      const response = await usuarioService.altaUsuario(usuario);
      Toast.show({
        type: 'success',
        text1: 'Usuario creado',
        text2: response.message,
        position: 'bottom',
      });
      formikActions.resetForm();
      if (onCreated) onCreated();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al crear usuario',
        text2:
          'Hubo un problema al crear el usuario. Por favor, inténtelo de nuevo.',
        position: 'bottom',
      });
    } finally {
      formikActions.setSubmitting(false);
    }
  };

  // Función para obtener los valores iniciales
  const getInitialValues = () => {
    return {
      email: usuarioVacio.email,
    };
  };

  const initialValues = getInitialValues();

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, formikActions) => {
        const usuarioNuevo: NuevoUsuario = {
          email: values.email,
        };

        crearUsuario(usuarioNuevo, formikActions);
      }}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        isSubmitting,
      }) => (
        <ScreenCard>
          <View>
            <Text className="font-geist-semi-bold text-text text-2xl">
              Alta de Nuevo Usuario
            </Text>
            <Text className="font-geist-light text-text text-base">
              Registre un nuevo usuario en el sistema
            </Text>
          </View>

          <Text className="font-geist text-text text-base mt-3">
            Correo electrónico
          </Text>
          <TextInput
            className="border-2 bg-white border-gray-300 rounded-md py-4 px-3 my-3 text-gray-500"
            value={values.email}
            onChangeText={handleChange('email')}
            onBlur={handleBlur('email')}
            placeholder="correo@ejemplo.com"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!isSubmitting}
          />
          {touched.email && errors.email && (
            <Text className="text-red-500 mt-2">{errors.email}</Text>
          )}

          <Text className="text-sm text-gray-500">
            Se enviará un enlace de registro al correo electrónico
            proporcionado. El usuario deberá completar el formulario para
            finalizar el registro.
          </Text>

          <CustomPressable
            className={`rounded-md py-2 px-4 mt-4 self-end ${
              isSubmitting ? 'bg-gray-400' : 'bg-black'
            }`}
            onPress={handleSubmit as any}
            disabled={isSubmitting} // Deshabilitar botón si está enviando
          >
            <Text className="font-geist-semi-bold text-sm text-center text-white">
              {isSubmitting ? 'Creando...' : 'Dar de alta usuario'}
            </Text>
          </CustomPressable>
        </ScreenCard>
      )}
    </Formik>
  );
};

export default NuevoUsuarioForm;
