import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import React, { useState } from 'react';
import { GermicidaNuevo, PiscinaEquipos } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';
import { Octagon } from 'react-native-feather';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  ionizadorMarca: Yup.string().required('Seleccione una marca de ionizador'),
  ionizadorElectrodos: Yup.number()
    .required('Ingrese la cantidad de electrodos')
    .typeError('La cantidad de electrodos debe ser un número')
    .min(1, 'La cantidad de electrodos debe ser mayor que 0'),
  ionizadorTiempoVidaUtil: Yup.number()
    .required('Ingrese el tiempo de vida útil del ionizador')
    .typeError('El tiempo de vida útil debe ser un número')
    .min(1, 'El tiempo de vida útil debe ser mayor que 0'),
});

const ModalAgregarIonizador = ({
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
  const [openMarcaIonizador, setOpenMarcaIonizador] = useState(false);

  const sistemaGermicida = piscina.sistemasGermicidas || [];
  const ionizadorExistente = sistemaGermicida.find(
    (s) => s.tipo === 'ionizador'
  );

  const handleNewIonizador = async (newIonizador: GermicidaNuevo) => {
    try {
      const response = await piscinaService.addGermicida(
        piscina.id,
        newIonizador
      );
      actualizarPiscina(); // Actualiza la piscina después de agregar el germicida
      Toast.show({
        type: 'success',
        text1: 'Ionizador agregado',
        text2: response.message || 'El ionizador se ha agregado correctamente.',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un problema al agregar el ionizador. Inténtelo de nuevo.',
        position: 'bottom',
      });
      console.error('Error adding ionizador:', error);
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
          ionizadorMarca: ionizadorExistente?.marca ?? '',
          ionizadorElectrodos: ionizadorExistente?.datoExtra
            ? ionizadorExistente.datoExtra.toString()
            : '',
          ionizadorTiempoVidaUtil:
            ionizadorExistente?.vidaRestante.toString() ?? '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const newIonizador: GermicidaNuevo = {
            id: null,
            tipo: 'IONIZADOR',
            marca: values.ionizadorMarca,
            datoExtra: Number(values.ionizadorElectrodos),
            tiempoVidaUtil: Number(values.ionizadorTiempoVidaUtil),
            activa: false,
          };
          handleNewIonizador(newIonizador);
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
                  <Text className="text-lg font-geist-semi-bold text-text mb-4">
                    Agregar Germicida
                  </Text>

                  <View className="items-center justify-between">
                    <View className="flex-row items-center">
                      <Octagon height={18} width={18} color={'orange'} />
                      <Text className="text-text text-base font-geist ml-1">
                        Ionizador de cobre
                      </Text>
                    </View>

                    <View className="items-start w-full">
                      <Text className="text-text text-sm font-geist">
                        Marca
                      </Text>
                      <TextInput
                        className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                        value={values.ionizadorMarca}
                        onChangeText={handleChange('ionizadorMarca')}
                        onBlur={handleBlur('ionizadorMarca')}
                        placeholder="Ingrese la marca del ionizador"
                        placeholderTextColor="#9CA3AF"
                      />
                      {errors.ionizadorMarca && touched.ionizadorMarca && (
                        <Text className="text-red-500 text-xs mt-1">
                          {errors.ionizadorMarca}
                        </Text>
                      )}
                      <View className="items-start w-full mt-2">
                        <Text className="text-text text-sm font-geist">
                          Electrodos
                        </Text>
                        <TextInput
                          className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                          value={values.ionizadorElectrodos}
                          onChangeText={handleChange('ionizadorElectrodos')}
                          onBlur={handleBlur('ionizadorElectrodos')}
                          keyboardType="numeric"
                          placeholder="Ej: 15"
                          placeholderTextColor="#9CA3AF"
                        />
                        {errors.ionizadorElectrodos &&
                          touched.ionizadorElectrodos && (
                            <Text className="text-red-500 text-xs mt-1">
                              {errors.ionizadorElectrodos}
                            </Text>
                          )}
                      </View>
                      <View className="items-start w-full mt-2">
                        <Text className="text-text text-sm font-geist">
                          Tiempo de vida útil en horas
                        </Text>
                        <TextInput
                          className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                          value={values.ionizadorTiempoVidaUtil}
                          onChangeText={handleChange('ionizadorTiempoVidaUtil')}
                          onBlur={handleBlur('ionizadorTiempoVidaUtil')}
                          keyboardType="numeric"
                          placeholder="Ej: 150"
                          placeholderTextColor="#9CA3AF"
                        />
                        {errors.ionizadorTiempoVidaUtil &&
                          touched.ionizadorTiempoVidaUtil && (
                            <Text className="text-red-500 text-xs mt-1">
                              {errors.ionizadorTiempoVidaUtil}
                            </Text>
                          )}
                      </View>
                    </View>
                  </View>
                          
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

export default ModalAgregarIonizador;
