import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import React, { useState } from 'react';
import DateTimePicker from 'react-native-modal-datetime-picker';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Registro } from '@/data/domain/piscina';
import { piscinaService } from '@/services/piscina.service';
import Toast from 'react-native-toast-message';
import { Calendar, Edit, Info, Settings, Tool } from 'react-native-feather';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  accion: Yup.string().required('La acción es obligatoria'),
  dispositivo: Yup.string().required('El dispositivo es obligatorio'),
  descripcion: Yup.string().required('La descripción es obligatoria'),
  tecnico: Yup.string().required('El técnico es obligatorio'),
});

type ModalNuevoRegistroProps = {
  visible: boolean;
  onClose: () => void;
  actualizarPiscina: () => void;
  piscinaId: number;
};

const ModalNuevoRegistro = ({
  visible,
  onClose,
  actualizarPiscina,
  piscinaId,
}: ModalNuevoRegistroProps) => {
  const [showDatePicker, setShowPicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleNuevoRegistro = async (registro: Registro) => {
    try {
      const response = await piscinaService.crearRegistro(registro, piscinaId);
      Toast.show({
        type: 'success',
        text1: 'Registro añadido',
        text2: response.message,
        position: 'bottom',
      });
      actualizarPiscina();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error al añadir el registro',
        text2: 'Ha ocurrido un error al añadir el nuevo registro.',
        position: 'bottom',
      });
    }
  };

  return (
    <Formik
      initialValues={{
        fecha: new Date(),
        dispositivo: '',
        accion: '',
        descripcion: '',
        tecnico: '',
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        const nuevoRegistro: Registro = {
          id: 0,
          fecha: values.fecha.toISOString().split('T')[0],
          dispositivo: values.dispositivo,
          accion: values.accion,
          descripcion: values.descripcion,
          nombreTecnico: values.tecnico,
        };
        handleNuevoRegistro(nuevoRegistro);
        onClose();
      }}
      enableReinitialize={false}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
      }) => {
        return (
          <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                  <Text className="text-text text-xl font-geist-bold mb-2 text-center">
                    Nuevo Registro
                  </Text>
                  <View className="flex-row items-center mb-1">
                    <Calendar height={16} width={16} color="#666" className="mr-2" />
                    <Text className="text-text text-base font-geist">
                      Fecha
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setShowPicker(true)}
                    className="border border-grayish-unique rounded-lg p-2 mb-3 bg-gray-100 active:bg-gray-200"
                    style={{ alignItems: 'center' }}
                  >
                    <Text className="text-text text-base font-geist-semi-bold">
                      {date.toLocaleDateString()}
                    </Text>
                  </Pressable>
                  {showDatePicker && (
                    <DateTimePicker
                      date={date}
                      mode="date"
                      display="default"
                      isVisible={showDatePicker}
                      onConfirm={(selectedDate) => {
                        setShowPicker(false);
                        setDate(selectedDate);
                      }}
                      onCancel={() => setShowPicker(false)}
                    />
                  )}

                  <View className="flex-row items-center mb-1">
                    <Edit height={16} width={16} color="#666" className="mr-2" />
                    <Text className="text-text text-base font-geist">
                      Acción
                    </Text>
                  </View>

                  <TextInput
                    className="border border-grayish-unique rounded-lg p-2 mb-3"
                    placeholder="Ej: Recambio de arena en filtro"
                    placeholderTextColor="#9CA3AF"
                    value={values.accion}
                    onChangeText={handleChange('accion')}
                    onBlur={handleBlur('accion')}
                  />
                  {errors.accion && touched.accion && (
                    <Text className="text-red-500 text-sm mb-2">
                      {errors.accion}
                    </Text>
                  )}

                  <View className="flex-row items-center mb-1">
                    <Settings height={16} width={16} color="#666" className="mr-2"/>
                    <Text className="text-text text-base font-geist">
                      Dispositivo
                    </Text>
                  </View>

                  <TextInput
                    className="border border-grayish-unique rounded-lg p-2 mb-3"
                    placeholder="Ej: Bomba principal"
                    placeholderTextColor="#9CA3AF"
                    value={values.dispositivo}
                    onChangeText={handleChange('dispositivo')}
                    onBlur={handleBlur('dispositivo')}
                  />
                  {errors.dispositivo && touched.dispositivo && (
                    <Text className="text-red-500 text-sm mb-2">
                      {errors.dispositivo}
                    </Text>
                  )}

                  <View className="flex-row items-center mb-1">
                    <Info height={16} width={16} color="#666" className="mr-2" />
                    <Text className="text-text text-base font-geist">
                      Descripción
                    </Text>
                  </View>
                  <TextInput
                    className="border border-grayish-unique rounded-lg p-2 h-28 mb-3"
                    multiline
                    numberOfLines={4}
                    maxLength={500}
                    textAlignVertical="top"
                    placeholder="Breve descripción"
                    placeholderTextColor="#9CA3AF"
                    value={values.descripcion}
                    onChangeText={handleChange('descripcion')}
                    onBlur={handleBlur('descripcion')}
                  />
                  {errors.descripcion && touched.descripcion && (
                    <Text className="text-red-500 text-sm mb-2">
                      {errors.descripcion}
                    </Text>
                  )}

                  <View className="flex-row items-center mb-1">
                    <Tool height={16} width={16} color="#666" className="mr-2" />
                    <Text className="text-text text-base font-geist">
                      Técnico
                    </Text>
                  </View>
                  <TextInput
                    className="border border-grayish-unique rounded-lg p-2 mb-3"
                    placeholder="Nombre y apellido del técnico"
                    placeholderTextColor="#9CA3AF"
                    value={values.tecnico}
                    onChangeText={handleChange('tecnico')}
                    onBlur={handleBlur('tecnico')}
                  />
                  {errors.tecnico && touched.tecnico && (
                    <Text className="text-red-500 text-sm mb-2">
                      {errors.tecnico}
                    </Text>
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
          </Modal>
        );
      }}
    </Formik>
  );
};

export default ModalNuevoRegistro;
