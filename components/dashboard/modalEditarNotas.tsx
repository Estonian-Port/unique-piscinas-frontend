import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { PiscinaFichaTecnica } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  notas: Yup.string().max(100, 'Máximo 100 caracteres'),
});

const ModalEditarNotas = ({
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
          notas: pool.notas,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSave({
            ...pool,
            notas: values.notas,
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
        }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                <Text className="text-lg font-geist-semi-bold text-text text-center">
                  Editar Notas
                </Text>

                <Text className="font-geist text-text text-base mt-3">
                  Notas adicionales
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md p-2 h-40"
                  value={values.notas}
                  onChangeText={handleChange('notas')}
                  onBlur={handleBlur('notas')}
                  placeholder="Alguna información adicional que quieras agregar..."
                  placeholderTextColor="#9CA3AF"
                  multiline={true}
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                {touched.notas && errors.notas && (
                  <Text className="text-red-500 mt-2">{errors.notas}</Text>
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
        )}
      </Formik>
    </Modal>
  );
};

export default ModalEditarNotas;
