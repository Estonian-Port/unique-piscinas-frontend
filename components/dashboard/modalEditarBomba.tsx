import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Switch,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Bomba } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  marcaBomba: Yup.string().required('Seleccione una marca de bomba'),
  modeloBomba: Yup.string().required('Seleccione un modelo de bomba'),
  potenciaCV: Yup.number()
    .required('Ingrese la potencia en CV')
    .typeError('La potencia debe ser un número')
    .min(1, 'La potencia debe ser mayor que 0'),
});

const ModalEditarBomba = ({
  visible,
  onClose,
  bomba,
  onSave, // Nueva prop
}: {
  visible: boolean;
  onClose: () => void;
  bomba: Bomba;
  onSave: (bombaEditada: Bomba) => void;
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
          marcaBomba: bomba.marca,
          modeloBomba: bomba.modelo,
          potenciaCV: bomba.potencia,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSave({
            ...bomba,
            marca: values.marcaBomba,
            modelo: values.modeloBomba,
            potencia: values.potenciaCV,
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
                <Text className="text-xl font-geist-semi-bold text-text">
                  Editar Bomba
                </Text>

                <Text className="font-geist text-text text-base mt-3">
                  Marca
                </Text>

                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.marcaBomba}
                  onChangeText={handleChange('marcaBomba')}
                  onBlur={handleBlur('marcaBomba')}
                  placeholder="Ingrese la marca de la bomba"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.marcaBomba && touched.marcaBomba && (
                  <Text className="text-red-500">{errors.marcaBomba}</Text>
                )}

                <Text className="font-geist text-text text-base mt-3">
                  Modelo
                </Text>

                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.modeloBomba}
                  onChangeText={handleChange('modeloBomba')}
                  onBlur={handleBlur('modeloBomba')}
                  placeholder="Ingrese el modelo de la bomba"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.modeloBomba && touched.modeloBomba && (
                  <Text className="text-red-500">{errors.modeloBomba}</Text>
                )}

                <Text className="font-geist text-text text-base mt-3">
                  Potencia
                </Text>

                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  placeholder="Potencia en CV"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="numeric"
                  onChangeText={handleChange('potenciaCV')}
                  value={String(values.potenciaCV)}
                />
                {errors.potenciaCV && touched.potenciaCV && (
                  <Text className="text-red-500">{errors.potenciaCV}</Text>
                )}

                <View className="flex-row justify-between mt-3">
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

export default ModalEditarBomba;
