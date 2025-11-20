import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { Calefaccion } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import RadioButton from '../utiles/radioButton';
import CustomPressable from '../utiles/customPressable';

export type TipoCalefaccion = 'Bomba de calor' | 'Calentador de gas';

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

const ModalEditarCalefaccion = ({
  visible,
  onClose,
  calefaccion,
  onSave, // Nueva prop
}: {
  visible: boolean;
  onClose: () => void;
  calefaccion: Calefaccion;
  onSave: (calefaccionEditada: Calefaccion) => void;
}) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Formik
        initialValues={{
          tipoCalefaccion: calefaccion.tipo ?? '',
          marcaCalefaccion: calefaccion.marca ?? '',
          modeloCalefaccion: calefaccion.modelo ?? '',
          potenciaCalefaccion: calefaccion.potencia
            ? calefaccion.potencia.toString()
            : '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSave({
            ...calefaccion,
            tipo: values.tipoCalefaccion,
            marca: values.marcaCalefaccion,
            modelo: values.modeloCalefaccion,
            potencia: values.potenciaCalefaccion
              ? parseFloat(values.potenciaCalefaccion)
              : 0,
          });
          onClose();
        }}
      >
        {({
          handleChange,
          handleSubmit,
          handleBlur,
          values,
          setFieldValue,
          setFieldTouched,
          errors,
          touched,
          dirty,
        }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                <Text className="text-lg font-geist-semi-bold text-text mb-4">
                  Editar Calefacción
                </Text>
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
                  className="border border-gray-200 rounded-md py-4 px-3"
                  value={values.potenciaCalefaccion}
                  onChangeText={handleChange('potenciaCalefaccion')}
                  onBlur={handleBlur('potenciaCalefaccion')}
                  keyboardType="numeric"
                  placeholder="Ej: 13.5"
                  placeholderTextColor="#9CA3AF"
                />
                {touched.potenciaCalefaccion && errors.potenciaCalefaccion && (
                  <Text className="text-red-500 mt-2">
                    {errors.potenciaCalefaccion}
                  </Text>
                )}

                <View className="flex-row justify-between mt-3">
                  <CustomPressable
                    onPress={onClose}
                    className="bg-gray-400 rounded-lg items-center justify-center h-12 mr-1"
                    containerClassName="w-1/2"
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
                    containerClassName="w-1/2"
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-white text-center font-geist-semi-bold">
                        Guardar cambios
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

export default ModalEditarCalefaccion;
