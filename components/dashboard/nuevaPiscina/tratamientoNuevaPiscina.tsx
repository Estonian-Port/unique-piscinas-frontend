import {
  View,
  Text,
  TextInput,
  Switch,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Link } from 'expo-router';
import PasosFormulario from './pasosFormulario';
import { PiscinaNueva, GermicidaNuevo } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { Activity, Database, Zap } from 'react-native-feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomPressable from '@/components/utiles/customPressable';

const validationSchema = Yup.object().shape({
  uvMarca: Yup.string().when('uvSwitch', {
    is: true,
    then: (schema) => schema.required('Ingrese la marca de la lámpara UV'),
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
    then: (schema) => schema.required('Ingrese la marca del ionizador'),
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
    then: (schema) => schema.required('Ingrese la marca del trasductor'),
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
  trasductorTiempoVidaUtil: Yup.number().when('trasductorSwitch', {
    is: true,
    then: (schema) =>
      schema
        .required('Ingrese el tiempo de vida útil del trasductor')
        .typeError('El tiempo de vida útil debe ser un número')
        .min(1, 'El tiempo de vida útil debe ser mayor que 0'),
    otherwise: (schema) => schema.notRequired(),
  }),
  ionizadorTiempoVidaUtil: Yup.number().when('ionizadorSwitch', {
    is: true,
    then: (schema) =>
      schema
        .required('Ingrese el tiempo de vida útil del ionizador')
        .typeError('El tiempo de vida útil debe ser un número')
        .min(1, 'El tiempo de vida útil debe ser mayor que 0'),
    otherwise: (schema) => schema.notRequired(),
  }),
  uvTiempoVidaUtil: Yup.number().when('uvSwitch', {
    is: true,
    then: (schema) =>
      schema
        .required('Ingrese el tiempo de vida útil del UV')
        .typeError('El tiempo de vida útil debe ser un número')
        .min(1, 'El tiempo de vida útil debe ser mayor que 0'),
    otherwise: (schema) => schema.notRequired(),
  }),
  cloradorSalino: Yup.boolean(),
  controlPh: Yup.boolean(),
  controlOrp: Yup.boolean(),
  uvSwitch: Yup.boolean(),
  ionizadorSwitch: Yup.boolean(),
  trasductorSwitch: Yup.boolean(),
});

interface FormValues {
  cloradorSalino: boolean;
  controlPh: boolean;
  controlOrp: boolean;
  uvSwitch: boolean;
  uvMarca: string;
  uvPotencia: string;
  uvTiempoVidaUtil: string;
  ionizadorSwitch: boolean;
  ionizadorMarca: string;
  ionizadorElectrodos: string;
  ionizadorTiempoVidaUtil: string;
  trasductorSwitch: boolean;
  trasductorMarca: string;
  trasductorPotencia: string;
  trasductorTiempoVidaUtil: string;
}

const TratamientoNuevaPiscina = ({
  onCancel,
  onBack,
  onNext,
  nuevaPiscina,
  setNuevaPiscina,
}: {
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  nuevaPiscina: PiscinaNueva;
  setNuevaPiscina: (piscina: PiscinaNueva) => void;
}) => {
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardOpen(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardOpen(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const getInitialValues = (): FormValues => {
    const sistemaGermicida = nuevaPiscina.sistemaGermicida || [];
    const uvExistente = sistemaGermicida.find((s) => s.tipo === 'UV');
    const ionizadorExistente = sistemaGermicida.find(
      (s) => s.tipo === 'IONIZADOR'
    );
    const trasductorExistente = sistemaGermicida.find(
      (s) => s.tipo === 'TRASDUCTOR'
    );

    return {
      cloradorSalino: nuevaPiscina.cloroSalino ?? false,
      controlPh: nuevaPiscina.controlAutomaticoPH ?? false,
      controlOrp: nuevaPiscina.orp ?? false,
      uvSwitch: !!uvExistente,
      uvMarca: uvExistente?.marca ?? '',
      uvPotencia: uvExistente?.datoExtra
        ? uvExistente.datoExtra.toString()
        : '',
      uvTiempoVidaUtil: uvExistente?.tiempoVidaUtil?.toString() ?? '',
      ionizadorSwitch: !!ionizadorExistente,
      ionizadorMarca: ionizadorExistente?.marca ?? '',
      ionizadorElectrodos: ionizadorExistente?.datoExtra
        ? ionizadorExistente.datoExtra.toString()
        : '',
      ionizadorTiempoVidaUtil:
        ionizadorExistente?.tiempoVidaUtil?.toString() ?? '',
      trasductorSwitch: !!trasductorExistente,
      trasductorMarca: trasductorExistente?.marca ?? '',
      trasductorPotencia: trasductorExistente?.datoExtra
        ? trasductorExistente.datoExtra.toString()
        : '',
      trasductorTiempoVidaUtil:
        trasductorExistente?.tiempoVidaUtil?.toString() ?? '',
    };
  };

  const initialValues = getInitialValues();

  return (
    <View className="flex-1">
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const sistemaGermicida = [];

          if (values.uvSwitch) {
            const uv: GermicidaNuevo = {
              id: null,
              tipo: 'UV',
              marca: values.uvMarca,
              activa: true,
              datoExtra: parseFloat(values.uvPotencia),
              tiempoVidaUtil: parseInt(values.uvTiempoVidaUtil),
            };
            sistemaGermicida.push(uv);
          }

          if (values.ionizadorSwitch) {
            const ionizador: GermicidaNuevo = {
              id: null,
              tipo: 'IONIZADOR',
              marca: values.ionizadorMarca,
              activa: true,
              datoExtra: parseInt(values.ionizadorElectrodos),
              tiempoVidaUtil: parseInt(values.ionizadorTiempoVidaUtil),
            };
            sistemaGermicida.push(ionizador);
          }

          if (values.trasductorSwitch) {
            const trasductor: GermicidaNuevo = {
              id: null,
              tipo: 'TRASDUCTOR',
              marca: values.trasductorMarca,
              activa: true,
              datoExtra: parseFloat(values.trasductorPotencia),
              tiempoVidaUtil: parseInt(values.trasductorTiempoVidaUtil),
            };
            sistemaGermicida.push(trasductor);
          }

          setNuevaPiscina({
            ...nuevaPiscina,
            cloroSalino: values.cloradorSalino,
            controlAutomaticoPH: values.controlPh,
            orp: values.controlOrp,
            sistemaGermicida: sistemaGermicida,
          });
          onNext();
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
          setFieldValue,
          setFieldTouched,
          validateForm,
        }) => {
          useEffect(() => {
            validateForm();
          }, [
            values.uvSwitch,
            values.ionizadorSwitch,
            values.trasductorSwitch,
            validateForm,
          ]);

          return (
            <>
              <KeyboardAwareScrollView
                ref={scrollViewRef}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === 'ios' ? 30 : 30}
                extraHeight={Platform.OS === 'ios' ? 150 : 150}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
                enableResetScrollToCoords={false}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                <View className="py-5 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-geist-semi-bold text-text text-xl">
                      Equipamiento
                    </Text>
                    <PasosFormulario paso={5} />
                  </View>
                  <Text className="font-geist-semi-bold text-text text-lg mt-2">
                    Tratamiento
                  </Text>
                  <View className="border-b border-gray-200">
                    <Text className="font-geist-semi-bold text-text text-base mt-3">
                      Dosificación química
                    </Text>
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-text text-base font-geist">
                        Clorador salino
                      </Text>
                      <Switch
                        trackColor={{ false: '#d3d3d3', true: '#000000' }}
                        thumbColor={
                          values.cloradorSalino ? '#fcdb99' : '#ffffff'
                        }
                        ios_backgroundColor="#d3d3d3"
                        onValueChange={(value) => {
                          setFieldValue('cloradorSalino', value);
                        }}
                        value={values.cloradorSalino}
                      />
                    </View>
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-text text-base font-geist">
                        Control automático de pH
                      </Text>
                      <Switch
                        trackColor={{ false: '#d3d3d3', true: '#000000' }}
                        thumbColor={values.controlPh ? '#fcdb99' : '#ffffff'}
                        ios_backgroundColor="#d3d3d3"
                        onValueChange={(value) => {
                          setFieldValue('controlPh', value);
                        }}
                        value={values.controlPh}
                      />
                    </View>
                    <View className="flex-row items-center justify-between mb-3">
                      <Text className="text-text text-base font-geist">
                        Control de ORP
                      </Text>
                      <Switch
                        trackColor={{ false: '#d3d3d3', true: '#000000' }}
                        thumbColor={values.controlOrp ? '#fcdb99' : '#ffffff'}
                        ios_backgroundColor="#d3d3d3"
                        onValueChange={(value) => {
                          setFieldValue('controlOrp', value);
                        }}
                        value={values.controlOrp}
                      />
                    </View>
                  </View>
                  <View className="border-b border-gray-200">
                    <Text className="font-geist-semi-bold text-text text-base mt-3">
                      Sistemas germicidas
                    </Text>
                    <View className="items-center justify-between">
                      <View className="flex-row items-center justify-between w-full py-2">
                        <View className="flex-row items-center">
                          <Zap height={18} width={18} color={'green'} />
                          <Text className="text-text text-base font-geist ml-1">
                            Sistema UV
                          </Text>
                        </View>
                        <Switch
                          trackColor={{ false: '#d3d3d3', true: '#000000' }}
                          thumbColor={values.uvSwitch ? '#fcdb99' : '#ffffff'}
                          ios_backgroundColor="#d3d3d3"
                          onValueChange={(value) => {
                            setFieldValue('uvSwitch', value);
                          }}
                          value={values.uvSwitch}
                        />
                      </View>
                      {values.uvSwitch && (
                        <View className="items-start w-4/5">
                          <Text className="text-text text-sm font-geist">
                            Marca
                          </Text>
                          <TextInput
                            className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                            value={values.uvMarca}
                            onChangeText={handleChange('uvMarca')}
                            onBlur={handleBlur('uvMarca')}
                            placeholder="Ingrese la marca de la lámpara UV"
                            placeholderTextColor="#9CA3AF"
                          />
                          {errors.uvMarca && touched.uvMarca && (
                            <Text className="text-red-500 text-xs mt-1">
                              {errors.uvMarca}
                            </Text>
                          )}
                          <View className="items-start w-full mt-2">
                            <Text className="text-text text-sm font-geist">
                              Potencia (W)
                            </Text>
                            <TextInput
                              className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                              value={values.uvPotencia}
                              onChangeText={handleChange('uvPotencia')}
                              onBlur={handleBlur('uvPotencia')}
                              keyboardType="numeric"
                              placeholder="Ej: 15"
                              placeholderTextColor="#9CA3AF"
                            />
                            {errors.uvPotencia && touched.uvPotencia && (
                              <Text className="text-red-500 text-xs mt-1">
                                {errors.uvPotencia}
                              </Text>
                            )}
                          </View>
                          <View className="items-start w-full mt-2">
                            <Text className="text-text text-sm font-geist">
                              Tiempo de vida útil en horas
                            </Text>
                            <TextInput
                              className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                              value={values.uvTiempoVidaUtil}
                              onChangeText={handleChange('uvTiempoVidaUtil')}
                              onBlur={handleBlur('uvTiempoVidaUtil')}
                              keyboardType="numeric"
                              placeholder="Ej: 150"
                              placeholderTextColor="#9CA3AF"
                            />
                            {errors.uvTiempoVidaUtil &&
                              touched.uvTiempoVidaUtil && (
                                <Text className="text-red-500 text-xs mt-1">
                                  {errors.uvTiempoVidaUtil}
                                </Text>
                              )}
                          </View>
                        </View>
                      )}
                    </View>
                    <View className="items-center justify-between">
                      <View className="flex-row items-center justify-between w-full py-2">
                        <View className="flex-row items-center">
                          <Database height={18} width={18} color={'orange'} />
                          <Text className="text-text text-base font-geist ml-1">
                            Ionizador de cobre
                          </Text>
                        </View>
                        <Switch
                          trackColor={{ false: '#d3d3d3', true: '#000000' }}
                          thumbColor={
                            values.ionizadorSwitch ? '#fcdb99' : '#ffffff'
                          }
                          ios_backgroundColor="#d3d3d3"
                          onValueChange={(value) => {
                            setFieldValue('ionizadorSwitch', value);
                          }}
                          value={values.ionizadorSwitch}
                        />
                      </View>
                      {values.ionizadorSwitch && (
                        <View className="items-start w-4/5">
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
                              onChangeText={handleChange(
                                'ionizadorTiempoVidaUtil'
                              )}
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
                      )}
                    </View>
                    <View className="items-center justify-between">
                      <View className="flex-row items-center justify-between w-full py-2">
                        <View className="flex-row items-center">
                          <Activity height={18} width={18} color={'blue'} />
                          <Text className="text-text text-base font-geist ml-1">
                            Trasductor de ultrasonido
                          </Text>
                        </View>
                        <Switch
                          trackColor={{ false: '#d3d3d3', true: '#000000' }}
                          thumbColor={
                            values.trasductorSwitch ? '#fcdb99' : '#ffffff'
                          }
                          ios_backgroundColor="#d3d3d3"
                          onValueChange={(value) => {
                            setFieldValue('trasductorSwitch', value);
                          }}
                          value={values.trasductorSwitch}
                        />
                      </View>
                      {values.trasductorSwitch && (
                        <View className="items-start w-4/5 my-2">
                          <Text className="text-text text-sm font-geist">
                            Marca
                          </Text>
                          <TextInput
                            className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                            value={values.trasductorMarca}
                            onChangeText={handleChange('trasductorMarca')}
                            onBlur={handleBlur('trasductorMarca')}
                            placeholder="Ingrese la marca del transductor"
                            placeholderTextColor="#9CA3AF"
                          />
                          {errors.trasductorMarca &&
                            touched.trasductorMarca && (
                              <Text className="text-red-500 text-xs mt-1">
                                {errors.trasductorMarca}
                              </Text>
                            )}
                          <View className="items-start w-full mt-2">
                            <Text className="text-text text-sm font-geist">
                              Potencia (W)
                            </Text>
                            <TextInput
                              className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                              value={values.trasductorPotencia}
                              onChangeText={handleChange('trasductorPotencia')}
                              onBlur={handleBlur('trasductorPotencia')}
                              keyboardType="numeric"
                              placeholder="Ej: 15"
                              placeholderTextColor="#9CA3AF"
                            />
                            {errors.trasductorPotencia &&
                              touched.trasductorPotencia && (
                                <Text className="text-red-500 text-xs mt-1">
                                  {errors.trasductorPotencia}
                                </Text>
                              )}
                          </View>
                          <View className="items-start w-full mt-2">
                            <Text className="text-text text-sm font-geist">
                              Tiempo de vida útil en horas
                            </Text>
                            <TextInput
                              className="border-2 border-gray-300 rounded-md py-4 px-3 w-full"
                              value={values.trasductorTiempoVidaUtil}
                              onChangeText={handleChange(
                                'trasductorTiempoVidaUtil'
                              )}
                              onBlur={handleBlur('trasductorTiempoVidaUtil')}
                              keyboardType="numeric"
                              placeholder="Ej: 150"
                              placeholderTextColor="#9CA3AF"
                            />
                            {errors.trasductorTiempoVidaUtil &&
                              touched.trasductorTiempoVidaUtil && (
                                <Text className="text-red-500 text-xs mt-1">
                                  {errors.trasductorTiempoVidaUtil}
                                </Text>
                              )}
                          </View>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Padding inferior para dar espacio sobre los botones fijos */}
                  <View style={{ height: keyboardOpen ? 20 : 0 }} />
                </View>
              </KeyboardAwareScrollView>

              {/* Botones fijos en la parte inferior */}
              <View className="border-t border-gray-200 bg-white px-4 py-3 absolute bottom-0 left-0 right-0">
                <View className="flex-row items-center justify-center gap-3">
                  <Link asChild href="/dashboard">
                    <CustomPressable
                      onPress={onCancel}
                      className="border-2 border-grayish-unique rounded-md p-3 items-center justify-center shadow-sm bg-white"
                      containerClassName="w-1/3"
                    >
                      <Text className="text-text font-geist-semi-bold text-base">
                        Cancelar
                      </Text>
                    </CustomPressable>
                  </Link>
                  <CustomPressable
                    onPress={onBack}
                    className="border-2 border-gray-400 rounded-md p-3 items-center justify-center bg-grayish-unique shadow-sm"
                    containerClassName="w-1/3"
                  >
                    <Text className="text-text text-base font-geist-semi-bold px-2">
                      Volver
                    </Text>
                  </CustomPressable>
                  <CustomPressable
                    onPress={handleSubmit as any}
                    className="border-2 border-navy-unique rounded-md p-3 items-center justify-center bg-purple-unique shadow-sm"
                    containerClassName="w-1/3"
                  >
                    <Text className="text-white text-base font-geist-semi-bold">
                      Siguiente
                    </Text>
                  </CustomPressable>
                </View>
              </View>
            </>
          );
        }}
      </Formik>
    </View>
  );
};

export default TratamientoNuevaPiscina;
