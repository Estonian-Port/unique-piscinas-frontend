import {
  View,
  Text,
  KeyboardAvoidingView,
  Modal,
  Platform,
  TextInput,
} from 'react-native';
import React from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { CalefaccionNueva, PiscinaEquipos } from '@/data/domain/piscina';
import RadioButton from '../utiles/radioButton';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  marcaCalefaccion: Yup.string().required(
    'Seleccione una marca de calefacción'
  ),
  modeloCalefaccion: Yup.string().required(
    'Seleccione un modelo de calefacción'
  ),
  potenciaCalefaccion: Yup.number()
    .typeError('La potencia debe ser un número')
    .required('Ingrese la potencia de la calefacción')
    .min(0.1, 'La potencia debe ser mayor que 0'),
});

const ModalAgregarCalefaccion = ({
  visible,
  onClose,
  piscina,
  actualizarPiscina,
}: {
  visible: boolean;
  onClose: () => void;
  piscina: PiscinaEquipos;
  actualizarPiscina: () => void;
}) => {
  const calefaccionoVacia: CalefaccionNueva = {
    id: null,
    tipo: 'Bomba de calor',
    marca: '',
    modelo: '',
    potencia: 0,
    activa: false,
  };

  const handleNewCalefaccion = async (newCalefaccion: CalefaccionNueva) => {
    try {
      const response = await piscinaService.addCalefaccion(
        piscina.id,
        newCalefaccion
      );
      actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Calefacción agregada',
        text2: response.message,
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se pudo agregar la calefacción',
        position: 'bottom',
      });
      console.error('Error al agregar la calefacción:', error);
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
          tipoCalefaccion: calefaccionoVacia.tipo,
          marcaCalefaccion: calefaccionoVacia.marca,
          modeloCalefaccion: calefaccionoVacia.modelo,
          potenciaCalefaccion:
            calefaccionoVacia.potencia == 0
              ? ''
              : calefaccionoVacia.potencia.toString(),
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const nuevaCalefaccion: CalefaccionNueva = {
            id: null,
            tipo: values.tipoCalefaccion,
            marca: values.marcaCalefaccion,
            modelo: values.modeloCalefaccion,
            potencia: Number(values.potenciaCalefaccion),
            activa: true,
          };
          handleNewCalefaccion(nuevaCalefaccion);
          onClose();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
          setFieldTouched,
          validateForm,
          setTouched,
        }) => {
          return (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                  <Text className="text-lg font-geist-semi-bold text-text mb-4">
                    Agregar Bomba
                  </Text>

                  <Text className="font-geist text-text text-base mt-3">
                    Tipo:
                  </Text>
                  <RadioButton
                    value={'Bomba de calor'}
                    label={'Bomba de calor'}
                    selected={values.tipoCalefaccion === 'Bomba de calor'}
                    onPress={(value) => {
                      setFieldValue('tipoCalefaccion', value);
                      setFieldTouched('tipoCalefaccion', true);
                    }}
                  />

                  <RadioButton
                    value={'Calentador de gas'}
                    label={'Calentador de gas'}
                    selected={values.tipoCalefaccion === 'Calentador de gas'}
                    onPress={(value) => {
                      setFieldValue('tipoCalefaccion', value);
                      setFieldTouched('tipoCalefaccion', true);
                    }}
                  />

                  {touched.tipoCalefaccion && errors.tipoCalefaccion && (
                    <Text className="text-red-500 mt-2">
                      {errors.tipoCalefaccion}
                    </Text>
                  )}

                  <Text className="font-geist text-text text-base mt-3">
                    Marca
                  </Text>
                  <TextInput
                    className="border border-gray-200 rounded-md py-4 px-3"
                    value={values.marcaCalefaccion}
                    onChangeText={handleChange('marcaCalefaccion')}
                    onBlur={handleBlur('marcaCalefaccion')}
                    placeholder="Ej: Hayward"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.marcaCalefaccion && errors.marcaCalefaccion && (
                    <Text className="text-red-500 mt-2">
                      {errors.marcaCalefaccion}
                    </Text>
                  )}

                  <Text className="font-geist text-text text-base mt-3">
                    Modelo
                  </Text>
                  <TextInput
                    className="border border-gray-200 rounded-md py-4 px-3"
                    value={values.modeloCalefaccion}
                    onChangeText={handleChange('modeloCalefaccion')}
                    onBlur={handleBlur('modeloCalefaccion')}
                    placeholder="Ej: EnergyLine Pro"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.modeloCalefaccion && errors.modeloCalefaccion && (
                    <Text className="text-red-500 mt-2">
                      {errors.modeloCalefaccion}
                    </Text>
                  )}

                  <Text className="font-geist text-text text-base mt-3">
                    Potencia (kW)
                  </Text>
                  <TextInput
                    className="border border-gray-200 rounded-md py-4 px-3 "
                    value={values.potenciaCalefaccion.toString()}
                    onChangeText={handleChange('potenciaCalefaccion')}
                    onBlur={handleBlur('potenciaCalefaccion')}
                    keyboardType="numeric"
                    placeholder="Ej: 13.5"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.potenciaCalefaccion &&
                    errors.potenciaCalefaccion && (
                      <Text className="text-red-500 mt-2">
                        {errors.potenciaCalefaccion}
                      </Text>
                    )}

                  <View className="flex-row justify-between mt-3">
                    <CustomPressable
                      onPress={onClose}
                      className="bg-gray-400 rounded-lg mr-1 items-center justify-center h-12"
                      containerClassName="w-1/2"
                    >
                      <Text className="text-text text-center font-geist-semi-bold">
                        Cancelar
                      </Text>
                    </CustomPressable>
                    <CustomPressable
                      onPress={handleSubmit as any}
                      className="bg-purple-unique rounded-lg ml-1 items-center justify-center h-12"
                      containerClassName="w-1/2"
                    >
                      <Text className="text-white text-center font-geist-semi-bold">
                        Guardar cambios
                      </Text>
                    </CustomPressable>
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          );
        }}
      </Formik>
    </Modal>
  );
};

export default ModalAgregarCalefaccion;
