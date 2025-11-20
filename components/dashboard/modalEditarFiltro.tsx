import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { Filtro } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import RadioButton from '../utiles/radioButton';
import CustomPressable from '../utiles/customPressable';

export type TipoFiltro = 'Arena' | 'Vidrio' | 'Cartucho';

export const marcasFiltro = [
  { id: 1, name: 'Astral' },
  { id: 2, name: 'Hayward' },
  { id: 3, name: 'Pentair' },
  { id: 4, name: 'Otra' },
];

export const modelosFiltro = [
  { id: 1, name: 'Aster' },
  { id: 2, name: 'Cantabric' },
  { id: 3, name: 'Berlin' },
  { id: 4, name: 'Otro' },
];

const validationSchema = Yup.object().shape({
  tipoFiltro: Yup.string().required('Seleccione un tipo de filtro'),
  marcaFiltro: Yup.string().required('Seleccione una marca de filtro'),
  modeloFiltro: Yup.string().required('Seleccione un modelo de filtro'),
  diametro: Yup.number()
    .required('Ingrese el diámetro del filtro')
    .typeError('El diámetro debe ser un número')
    .min(0.1, 'El diámetro debe ser mayor que 0'),
  datoExtra: Yup.number()
    .required('Este campo es obligatorio para este tipo de filtro')
    .typeError('El valor debe ser un número')
    .min(0.1, 'El valor debe ser mayor que 0'),
});

const ModalEditarFiltro = ({
  visible,
  onClose,
  filtro,
  onSave, // Nueva prop
}: {
  visible: boolean;
  onClose: () => void;
  filtro: Filtro;
  onSave: (filtroEditado: Filtro) => void;
}) => {
  const [openMarcaFiltro, setOpenMarcaFiltro] = useState(false);
  const [openModeloFiltro, setOpenModeloFiltro] = useState(false);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Formik
        initialValues={{
          tipoFiltro: filtro.tipo,
          marcaFiltro: filtro.marca,
          modeloFiltro: filtro.modelo,
          diametro: filtro.diametro,
          datoExtra: filtro.datoExtra,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          onSave({
            ...filtro,
            tipo: values.tipoFiltro,
            marca: values.marcaFiltro,
            modelo: values.modeloFiltro,
            diametro: values.diametro,
            datoExtra: values.datoExtra,
          });
          onClose();
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
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
                <Text className="text-xl font-geist-semi-bold text-text">
                  Editar Filtro
                </Text>

                <Text className="font-geist text-text text-base mt-3">
                  Marca
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.marcaFiltro}
                  onChangeText={handleChange('marcaFiltro')}
                  onBlur={handleBlur('marcaFiltro')}
                  placeholder="Ingrese la marca del filtro"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.marcaFiltro && touched.marcaFiltro && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.marcaFiltro}
                  </Text>
                )}

                <Text className="font-geist text-text text-base mt-3">
                  Modelo
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.modeloFiltro}
                  onChangeText={handleChange('modeloFiltro')}
                  onBlur={handleBlur('modeloFiltro')}
                  placeholder="Ingrese el modelo del filtro"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.modeloFiltro && touched.modeloFiltro && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.modeloFiltro}
                  </Text>
                )}

                <Text className="font-geist text-text text-base mt-3">
                  Diámetro (mm)
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.diametro.toString()}
                  onChangeText={handleChange('diametro')}
                  onBlur={handleBlur('diametro')}
                  keyboardType="numeric"
                  placeholder="Ej: 500"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.diametro && touched.diametro && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.diametro}
                  </Text>
                )}

                <Text className="font-geist text-text text-base mt-3">
                  {values.tipoFiltro === 'Arena'
                    ? 'Cantidad de arena (kg)'
                    : values.tipoFiltro === 'Vidrio'
                    ? 'Cantidad de vidrio (kg)'
                    : 'Micras del cartucho'}
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.datoExtra ? values.datoExtra.toString() : ''}
                  onChangeText={handleChange('datoExtra')}
                  onBlur={handleBlur('datoExtra')}
                  keyboardType="numeric"
                  placeholder="Ej: 75"
                  placeholderTextColor="#9CA3AF"
                />
                {errors.datoExtra && touched.datoExtra && (
                  <Text className="text-red-500 text-sm mt-1">
                    {errors.datoExtra}
                  </Text>
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

export default ModalEditarFiltro;
