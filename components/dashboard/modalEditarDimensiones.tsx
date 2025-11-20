import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Pressable,
} from 'react-native';
import { PiscinaFichaTecnica } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Checkbox from 'expo-checkbox';
import { FastForward, Grid } from 'react-native-feather';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  largo: Yup.number()
    .required('El largo es obligatorio')
    .typeError('El valor debe ser un número')
    .min(0.1, 'El largo debe ser mayor que 0'),
  ancho: Yup.number()
    .required('El ancho es obligatorio')
    .typeError('El valor debe ser un número')
    .min(0.1, 'El ancho debe ser mayor que 0'),
  profundidad: Yup.number()
    .required('La profundidad es obligatoria')
    .typeError('El valor debe ser un número')
    .min(0.1, 'La profundidad debe ser mayor que 0'),
  volumen: Yup.number()
    .required('El volumen es obligatorio')
    .typeError('El valor debe ser un número')
    .min(0.1, 'El volumen debe ser mayor que 0'),
  desbordante: Yup.boolean(),
  volumenTC: Yup.number().when('desbordante', {
    is: true,
    then: (schema) =>
      schema
        .required('El volumen T.C. es obligatorio')
        .typeError('El valor debe ser un número')
        .min(0.1, 'El volumen T.C. debe ser mayor que 0'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const ModalEditarDimensiones = ({
  visible,
  onClose,
  pool,
  onSave, // Nueva prop
}: {
  visible: boolean;
  onClose: () => void;
  pool: PiscinaFichaTecnica;
  onSave: (poolEditado: PiscinaFichaTecnica) => void;
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
          largo: pool.largo ? pool.largo.toString() : '',
          ancho: pool.ancho ? pool.ancho.toString() : '',
          profundidad: pool.profundidad ? pool.profundidad.toString() : '',
          volumen: pool.volumen ? pool.volumen.toString() : '',
          desbordante: pool.esDesbordante ?? false,
          volumenTC: pool.volumenTC ? pool.volumenTC.toString() : '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSave({
            ...pool,
            esDesbordante: values.desbordante,
            largo: parseFloat(values.largo),
            ancho: parseFloat(values.ancho),
            profundidad: parseFloat(values.profundidad),
            volumen: parseFloat(values.volumen),
            volumenTC: values.desbordante ? parseFloat(values.volumenTC) : 0,
          });
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
          validateForm,
          setFieldValue,
        }) => {
          // Efecto para revalidar cuando cambia desbordante
          useEffect(() => {
            validateForm();
          }, [values.desbordante, validateForm]);

          const calcularVolumen = () => {
            const { largo, ancho, profundidad } = values;
            if (largo && ancho && profundidad) {
              const largoNum = parseFloat(largo.toString());
              const anchoNum = parseFloat(ancho.toString());
              const profundidadNum = parseFloat(profundidad.toString());

              if (
                !isNaN(largoNum) &&
                !isNaN(anchoNum) &&
                !isNaN(profundidadNum) &&
                largoNum > 0 &&
                anchoNum > 0 &&
                profundidadNum > 0
              ) {
                const volumenNum = largoNum * anchoNum * profundidadNum;
                setFieldValue('volumen', volumenNum.toFixed(2));
              }
            }
          };

          return (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                  <Text className="text-lg font-geist-semi-bold text-text text-center">
                    Editar Dimensiones
                  </Text>

                  <View className="flex-row items-center mt-4">
                    <Checkbox
                      value={values.desbordante}
                      onValueChange={(value) => {
                        setFieldValue('desbordante', value);
                        // Limpiar volumenTC si se desmarca desbordante
                        if (!value) {
                          setFieldValue('volumenTC', '');
                        }
                      }}
                      color={values.desbordante ? '#0F0D23' : undefined}
                    />
                    <Pressable
                      onPress={() => {
                        const newValue = !values.desbordante;
                        setFieldValue('desbordante', newValue);
                        if (!newValue) {
                          setFieldValue('volumenTC', '');
                        }
                      }}
                      className="ml-2 flex-1"
                    >
                      <Text className="font-geist text-text text-base">
                        Piscina desbordante
                      </Text>
                      <Text className="font-geist-light text-text text-sm">
                        Piscina de tipo desbordante o infinity
                      </Text>
                    </Pressable>
                  </View>

                  <Text className="font-geist text-text text-base mt-3">
                    Largo (m)
                  </Text>
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.largo}
                    onChangeText={handleChange('largo')}
                    onBlur={handleBlur('largo')}
                    keyboardType="numeric"
                    placeholder="Ej: 10"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.largo && errors.largo && (
                    <Text className="text-red-500 mt-2">{errors.largo}</Text>
                  )}

                  <Text className="font-geist text-text text-base mt-3">
                    Ancho (m)
                  </Text>
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.ancho}
                    onChangeText={handleChange('ancho')}
                    onBlur={handleBlur('ancho')}
                    keyboardType="numeric"
                    placeholder="Ej: 5"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.ancho && errors.ancho && (
                    <Text className="text-red-500 mt-2">{errors.ancho}</Text>
                  )}

                  <Text className="font-geist text-text text-base mt-3">
                    Profundidad (m)
                  </Text>
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.profundidad}
                    onChangeText={handleChange('profundidad')}
                    onBlur={handleBlur('profundidad')}
                    keyboardType="numeric"
                    placeholder="Ej: 1.5"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.profundidad && errors.profundidad && (
                    <Text className="text-red-500 mt-2">
                      {errors.profundidad}
                    </Text>
                  )}

                  <View className="flex-row items-center justify-between mt-3 mb-1.5">
                    <Text className="font-geist text-text text-base">
                      Volumen (m³)
                    </Text>
                    <CustomPressable
                      className="p-2 border border-gray-200 rounded-md flex-row items-center justify-center gap-2"
                      onPress={calcularVolumen}
                    >
                      <FastForward />
                      <Text className="font-geist text-text">Calcular</Text>
                    </CustomPressable>
                  </View>

                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.volumen}
                    onChangeText={handleChange('volumen')}
                    onBlur={handleBlur('volumen')}
                    keyboardType="numeric"
                    placeholder="Ej: 75"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.volumen && errors.volumen && (
                    <Text className="text-red-500 mt-2">{errors.volumen}</Text>
                  )}

                  {values.desbordante && (
                    <>
                      <Text className="font-geist text-text text-base mt-3">
                        Volumen T.C. (m³)
                      </Text>
                      <TextInput
                        className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                        value={values.volumenTC}
                        onChangeText={handleChange('volumenTC')}
                        onBlur={handleBlur('volumenTC')}
                        keyboardType="numeric"
                        placeholder="Ej: 15"
                        placeholderTextColor="#9CA3AF"
                      />
                      {touched.volumenTC && errors.volumenTC && (
                        <Text className="text-red-500 mt-2">
                          {errors.volumenTC}
                        </Text>
                      )}
                    </>
                  )}

                <View className="flex-row justify-between mt-5">
                  <CustomPressable
                    onPress={onClose}
                    className="bg-gray-400 rounded-lg items-center justify-center h-12 mr-1"
                    containerClassName='w-1/2'
                  >
                    <Text className="text-white text-center font-geist-semi-bold">
                      Cancelar
                    </Text>
                  </CustomPressable>
                  <CustomPressable
                    onPress={handleSubmit as any}
                    className="bg-purple-unique rounded-lg items-center justify-center h-12 ml-1"
                    containerClassName='w-1/2'
                  >
                    <View className="flex-row items-center justify-center">
                      <Text className="text-white text-center font-geist-semi-bold ml-2">
                        Guardar
                      </Text>
                    </View>
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

export default ModalEditarDimensiones;
