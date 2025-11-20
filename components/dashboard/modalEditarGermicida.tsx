import {
  View,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Germicida } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  uvMarca: Yup.string().when('uvSwitch', {
    is: true,
    then: (schema) => schema.required('Seleccione una marca de lámpara UV'),
    otherwise: (schema) => schema.notRequired(),
  }),
  uvPotencia: Yup.number().when('uvSwitch', {
    is: true,
    then: (schema) =>
      schema
        .required('Ingrese la potencia')
        .typeError('La potencia debe ser un número')
        .min(1, 'La potencia debe ser mayor que 0'),
    otherwise: (schema) => schema.notRequired(),
  }),
  ionizadorMarca: Yup.string().when('ionizadorSwitch', {
    is: true,
    then: (schema) => schema.required('Seleccione una marca de ionizador'),
    otherwise: (schema) => schema.notRequired(),
  }),
  ionizadorElectrodos: Yup.number().when('ionizadorSwitch', {
    is: true,
    then: (schema) =>
      schema
        .required('Ingrese la cantidad de electrodos')
        .typeError('La cantidad de electrodos debe ser un número')
        .min(1, 'La cantidad de electrodos debe ser mayor que 0'),
    otherwise: (schema) => schema.notRequired(),
  }),
  trasductorMarca: Yup.string().when('trasductorSwitch', {
    is: true,
    then: (schema) => schema.required('Seleccione una marca del trasductor'),
    otherwise: (schema) => schema.notRequired(),
  }),
  trasductorPotencia: Yup.number().when('trasductorSwitch', {
    is: true,
    then: (schema) =>
      schema
        .required('Ingrese la potencia del trasductor')
        .typeError('La potencia debe ser un número')
        .min(1, 'La potencia debe ser mayor que 0'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const ModalEditarGermicida = ({
  visible,
  onClose,
  germicida,
  onSave,
}: {
  visible: boolean;
  onClose: () => void;
  germicida: Germicida;
  onSave: (germicidaEditado: Germicida) => void;
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
          tipo: germicida.tipo,
          marca: germicida.marca,
          vidaRestante: germicida.vidaRestante,
          activo: germicida.activo,
          estado: germicida.estado,
          datoExtra: germicida.datoExtra,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSave({
            ...germicida,
            tipo: values.tipo,
            marca: values.marca,
            vidaRestante: values.vidaRestante,
            activo: values.activo,
            estado: values.estado,
            datoExtra: values.datoExtra,
          });
          onClose();
        }}
        enableReinitialize={false} // Cambiado a false para mantener el estado
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
          dirty,
        }) => (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <View className="flex-1 justify-center items-center bg-black/50">
              <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                <Text className="font-geist-semi-bold text-text text-lg mb-3">
                  Editar sistema germicida - {germicida.tipo}
                </Text>
                {germicida.tipo === 'UV' && (
                  <>
                    <Text className="text-text text-sm font-geist">Marca</Text>
                    <TextInput
                      className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                      value={values.marca}
                      onChangeText={handleChange('marca')}
                      onBlur={handleBlur('marca')}
                      placeholder="Ingrese la marca del transductor"
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.marca && touched.marca && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.marca}
                      </Text>
                    )}
                    <View className="items-start w-full mt-2">
                      <Text className="text-text text-sm font-geist">
                        Potencia (W)
                      </Text>
                      <TextInput
                        className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                        value={values.datoExtra.toString()}
                        onChangeText={handleChange('datoExtra')}
                        onBlur={handleBlur('datoExtra')}
                        keyboardType="numeric"
                        placeholder="Ej: 15"
                        placeholderTextColor="#9CA3AF"
                      />
                      {errors.datoExtra && touched.datoExtra && (
                        <Text className="text-red-500 text-xs mt-1">
                          {errors.datoExtra}
                        </Text>
                      )}
                    </View>
                    {errors.vidaRestante && touched.vidaRestante && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.vidaRestante}
                      </Text>
                    )}
                  </>
                )}

                {germicida.tipo === 'Ionizador' && (
                  <>
                    <Text className="text-text text-sm font-geist">Marca</Text>
                    <TextInput
                      className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                      value={values.marca}
                      onChangeText={handleChange('marca')}
                      onBlur={handleBlur('marca')}
                      placeholder="Ingrese la marca del transductor"
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.marca && touched.marca && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.marca}
                      </Text>
                    )}
                    <View className="items-start w-full mt-2">
                      <Text className="text-text text-sm font-geist">
                        Electrodos
                      </Text>
                      <TextInput
                        className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                        value={values.datoExtra.toString()}
                        onChangeText={handleChange('datoExtra')}
                        onBlur={handleBlur('datoExtra')}
                        keyboardType="numeric"
                        placeholder="Ej: 15"
                        placeholderTextColor="#9CA3AF"
                      />
                      {errors.datoExtra && touched.datoExtra && (
                        <Text className="text-red-500 text-xs mt-1">
                          {errors.datoExtra}
                        </Text>
                      )}
                    </View>
                    {errors.vidaRestante && touched.vidaRestante && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.vidaRestante}
                      </Text>
                    )}
                  </>
                )}

                {germicida.tipo === 'Trasductor' && (
                  <>
                    <Text className="text-text text-sm font-geist">Marca</Text>
                    <TextInput
                      className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                      value={values.marca}
                      onChangeText={handleChange('marca')}
                      onBlur={handleBlur('marca')}
                      placeholder="Ingrese la marca del transductor"
                      placeholderTextColor="#9CA3AF"
                    />
                    {errors.marca && touched.marca && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.marca}
                      </Text>
                    )}
                    <View className="items-start w-full mt-2">
                      <Text className="text-text text-sm font-geist">
                        Potencia (W)
                      </Text>
                      <TextInput
                        className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                        value={values.datoExtra.toString()}
                        onChangeText={handleChange('datoExtra')}
                        onBlur={handleBlur('datoExtra')}
                        keyboardType="numeric"
                        placeholder="Ej: 15"
                        placeholderTextColor="#9CA3AF"
                      />
                      {errors.datoExtra && touched.datoExtra && (
                        <Text className="text-red-500 text-xs mt-1">
                          {errors.datoExtra}
                        </Text>
                      )}
                    </View>
                    {errors.vidaRestante && touched.vidaRestante && (
                      <Text className="text-red-500 text-xs mt-1">
                        {errors.vidaRestante}
                      </Text>
                    )}
                  </>
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

export default ModalEditarGermicida;
