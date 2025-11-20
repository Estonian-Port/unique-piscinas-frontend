import {
  View,
  Text,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { BombaNuevo, PiscinaEquipos } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';
import RadioButton from '../utiles/radioButton';
import CustomPressable from '../utiles/customPressable';

export const marcasBomba = [
  { id: 1, name: 'Astral' },
  { id: 2, name: 'Hayward' },
  { id: 3, name: 'Pentair' },
  { id: 4, name: 'Otra' },
];

export const modelosBomba = [
  { id: 1, name: 'Victoria Plus' },
  { id: 2, name: 'Sena' },
  { id: 3, name: 'Glass Plus' },
  { id: 4, name: 'Otro' },
];

const validationSchema = Yup.object().shape({
  marcaBomba: Yup.string().required('Seleccione una marca de bomba'),
  modeloBomba: Yup.string().required('Seleccione un modelo de bomba'),
  potenciaBomba: Yup.number()
    .required('Ingrese la potencia en CV')
    .typeError('La potencia debe ser un número')
    .min(1, 'La potencia debe ser mayor que 0'),
  tipo: Yup.string().required('Seleccione un tipo de bomba'),
});

const ModalAgregarBomba = ({
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
  const handleNewBomba = async (newBomba: BombaNuevo) => {
    try {
      const response = await piscinaService.addBomba(piscina.id, newBomba);
      actualizarPiscina();
      Toast.show({
        type: 'success',
        text1: 'Bomba agregada',
        text2: response.message,
        position: 'bottom',
      });
    } catch {
      Toast.show({
        type: 'error',
        text1: 'Error al agregar bomba',
        text2: 'Hubo un problema al agregar la bomba. Inténtelo de nuevo.',
        position: 'bottom',
      });
    }
  };

  const tieneBombaSecundaria = piscina.bombas.some(
    (bomba) => bomba.tipo === 'Secundaria'
  );

  const tieneBombaHidromasaje = piscina.bombas.some(
    (bomba) => bomba.tipo === 'Hidromasaje'
  );

  const tieneBombaCascada = piscina.bombas.some(
    (bomba) => bomba.tipo === 'Cascada'
  );

  const opcionesDisponibles = [
    !tieneBombaSecundaria ? 'Secundaria' : null,
    !tieneBombaCascada ? 'Cascada' : null,
    !tieneBombaHidromasaje ? 'Hidromasaje' : null,
  ].filter(Boolean) as string[];

  const tipoPorDefecto =
    opcionesDisponibles[0];

  const bombaVacia: BombaNuevo = {
    id: null,
    marca: '',
    modelo: '',
    potencia: 0,
    activa: true,
    tipo: '',
  };

  const formikRef = useRef<any>(null);

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Formik
        innerRef={formikRef}
        initialValues={{
          marcaBomba: bombaVacia.marca,
          modeloBomba: bombaVacia.modelo,
          potenciaBomba:
            bombaVacia.potencia == 0 ? '' : bombaVacia.potencia.toString(),
          tipo: tipoPorDefecto,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const nuevaBomba: BombaNuevo = {
            id: null,
            marca: values.marcaBomba,
            modelo: values.modeloBomba,
            potencia: Number(values.potenciaBomba),
            activa: false,
            tipo: values.tipo,
          };
          handleNewBomba(nuevaBomba);
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
        }) => {
          return (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                  <Text className="text-xl font-geist-semi-bold text-text">
                    Agregar Bomba
                  </Text>

                  <Text className="font-geist text-text text-base mt-3">
                    Tipo
                  </Text>
                  {!tieneBombaSecundaria && (
                    <RadioButton
                      value={'Secundaria'}
                      label={'Secundaria'}
                      selected={values.tipo === 'Secundaria'}
                      onPress={(value) => {
                        setFieldValue('tipo', value);
                      }}
                    />
                  )}
                  {!tieneBombaCascada && (
                    <RadioButton
                      value={'Cascada'}
                      label={'Cascada'}
                      selected={values.tipo === 'Cascada'}
                      onPress={(value) => {
                        setFieldValue('tipo', value);
                      }}
                    />
                  )}
                  {!tieneBombaHidromasaje && (
                    <RadioButton
                      value={'Hidromasaje'}
                      label={'Hidromasaje'}
                      selected={values.tipo === 'Hidromasaje'}
                      onPress={(value) => {
                        setFieldValue('tipo', value);
                      }}
                    />
                  )}
                  {touched.tipo && errors.tipo && (
                    <Text className="text-red-500 mt-2">{errors.tipo}</Text>
                  )}

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
                  {touched.marcaBomba && errors.marcaBomba && (
                    <Text className="text-red-500 mt-2">
                      {errors.marcaBomba}
                    </Text>
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
                  {touched.modeloBomba && errors.modeloBomba && (
                    <Text className="text-red-500 mt-2">
                      {errors.modeloBomba}
                    </Text>
                  )}

                  <Text className="font-geist text-text text-base mt-3">
                    Potencia (CV)
                  </Text>
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.potenciaBomba.toString()}
                    onChangeText={handleChange('potenciaBomba')}
                    onBlur={handleBlur('potenciaBomba')}
                    keyboardType="numeric"
                    placeholder="Ej: 15"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.potenciaBomba && errors.potenciaBomba && (
                    <Text className="text-red-500 mt-2">
                      {errors.potenciaBomba}
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
                      onPress={handleSubmit as any}
                      className="bg-purple-unique rounded-lg items-center justify-center h-12 ml-1"
                      containerClassName='w-1/2'
                    >
                      <View className="flex-row items-center justify-center">
                        <Text className="text-white text-center font-geist-semi-bold ml-2">
                          Agregar Bomba
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

export default ModalAgregarBomba;
