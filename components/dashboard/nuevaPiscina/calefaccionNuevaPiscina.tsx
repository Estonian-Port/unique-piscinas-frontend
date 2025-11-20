import {
  View,
  Text,
  TextInput,
  Switch,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import RadioButton from '../../utiles/radioButton';
import { Link } from 'expo-router';
import PasosFormulario from './pasosFormulario';
import { CalefaccionNueva, PiscinaNueva } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { Thermometer } from 'react-native-feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomPressable from '@/components/utiles/customPressable';

export type TipoCalefaccion = 'Bomba de calor' | 'Calentador de gas';

const validationSchema = Yup.object().shape({
  tipoCalefaccion: Yup.string().when('tieneCalefaccion', {
    is: true,
    then: (schema) => schema.required('Seleccione un tipo de calefacción'),
    otherwise: (schema) => schema.notRequired(),
  }),
  marcaCalefaccion: Yup.string().when('tieneCalefaccion', {
    is: true,
    then: (schema) => schema.required('Seleccione una marca de calefacción'),
    otherwise: (schema) => schema.notRequired(),
  }),
  modeloCalefaccion: Yup.string().when('tieneCalefaccion', {
    is: true,
    then: (schema) => schema.required('Seleccione un modelo de calefacción'),
    otherwise: (schema) => schema.notRequired(),
  }),
  potenciaCalefaccion: Yup.number()
    .typeError('La potencia debe ser un número')
    .when('tieneCalefaccion', {
      is: true,
      then: (schema) =>
        schema
          .required('Ingrese la potencia de la calefacción')
          .min(0.1, 'La potencia debe ser mayor que 0'),
      otherwise: (schema) => schema.notRequired(),
    }),
  tieneCalefaccion: Yup.boolean(),
});

interface FormValues {
  tieneCalefaccion: boolean;
  tipoCalefaccion: string;
  marcaCalefaccion: string;
  modeloCalefaccion: string;
  potenciaCalefaccion: string;
}

const CalefaccionNuevaPiscina = ({
  onCancel,
  onBack,
  onSave,
  nuevaPiscina,
  setNuevaPiscina,
}: {
  onCancel: () => void;
  onBack: () => void;
  onSave: () => void;
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

  const parsearTipo = (tipo: string): string => {
    if (tipo === 'Bomba de calor') return 'BOMBA_CALOR';
    if (tipo === 'Calentador de gas') return 'CALENTADOR_GAS';
    return tipo;
  };

  const getInitialValues = (): FormValues => {
    const calefaccionExistente = nuevaPiscina.calefaccion;

    return {
      tieneCalefaccion: !!calefaccionExistente,
      tipoCalefaccion: calefaccionExistente?.tipo ?? 'Bomba de calor',
      marcaCalefaccion: calefaccionExistente?.marca ?? '',
      modeloCalefaccion: calefaccionExistente?.modelo ?? '',
      potenciaCalefaccion: calefaccionExistente?.potencia
        ? calefaccionExistente.potencia.toString()
        : '',
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
          if (values.tieneCalefaccion) {
            const calefaccionNueva: CalefaccionNueva = {
              id: null,
              tipo: parsearTipo(values.tipoCalefaccion),
              marca: values.marcaCalefaccion,
              modelo: values.modeloCalefaccion,
              potencia: parseFloat(values.potenciaCalefaccion),
              activa: false,
            };

            nuevaPiscina.calefaccion = calefaccionNueva;
          } else {
            setNuevaPiscina({
              ...nuevaPiscina,
              calefaccion: null,
            });
          }
          onSave();
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
          setTouched,
        }) => {
          useEffect(() => {
            validateForm();
          }, [values.tieneCalefaccion, validateForm]);

          const handleSwitchChange = (value: boolean) => {
            setFieldValue('tieneCalefaccion', value);

            if (!value) {
              setTouched({
                ...touched,
                tipoCalefaccion: false,
                marcaCalefaccion: false,
                modeloCalefaccion: false,
                potenciaCalefaccion: false,
              });

              setFieldValue('tipoCalefaccion', 'Bomba de calor');
              setFieldValue('marcaCalefaccion', '');
              setFieldValue('modeloCalefaccion', '');
              setFieldValue('potenciaCalefaccion', '');
            }
          };

          return (
            <>
              <KeyboardAwareScrollView
                ref={scrollViewRef}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === 'ios' ? 30 : 30}
                extraHeight={Platform.OS === 'ios' ? 150 : 70}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                enableResetScrollToCoords={false}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                <View className="py-5 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-geist-semi-bold text-text text-xl">
                      Equipamiento
                    </Text>
                    <PasosFormulario paso={6} />
                  </View>
                  <View>
                    <Text className="font-geist-semi-bold text-text text-base mt-3">
                      Calefacción
                    </Text>
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Thermometer height={18} width={18} color={'orange'} />
                        <Text className="text-text text-base font-geist ml-1">
                          Sistema de Calefacción
                        </Text>
                      </View>
                      <Switch
                        trackColor={{ false: '#d3d3d3', true: '#000000' }}
                        thumbColor={
                          values.tieneCalefaccion ? '#fcdb99' : '#ffffff'
                        }
                        ios_backgroundColor="#d3d3d3"
                        onValueChange={handleSwitchChange}
                        value={values.tieneCalefaccion}
                      />
                    </View>
                    <View className="mx-2">
                      <Text
                        className={`font-geist text-text text-base mt-3 ${
                          !values.tieneCalefaccion ? 'text-gray-300' : ''
                        }`}
                      >
                        Tipo:
                      </Text>
                      <RadioButton
                        value={'Bomba de calor'}
                        label={'Bomba de calor'}
                        selected={values.tipoCalefaccion === 'Bomba de calor'}
                        onPress={(value) => {
                          setFieldValue('tipoCalefaccion', value);
                          setFieldTouched('tipoCalefaccion', true);
                        }}
                        disabled={!values.tieneCalefaccion}
                      />

                      <RadioButton
                        value={'Calentador de gas'}
                        label={'Calentador de gas'}
                        selected={
                          values.tipoCalefaccion === 'Calentador de gas'
                        }
                        onPress={(value) => {
                          setFieldValue('tipoCalefaccion', value);
                          setFieldTouched('tipoCalefaccion', true);
                        }}
                        disabled={!values.tieneCalefaccion}
                      />

                      {values.tieneCalefaccion &&
                        touched.tipoCalefaccion &&
                        errors.tipoCalefaccion && (
                          <Text className="text-red-500 mt-2">
                            {errors.tipoCalefaccion}
                          </Text>
                        )}

                      <Text
                        className={`font-geist text-text text-base mt-3 ${
                          !values.tieneCalefaccion ? 'text-gray-300' : ''
                        }`}
                      >
                        Marca
                      </Text>
                      <TextInput
                        className={`border border-gray-200 rounded-md py-4 px-3 ${
                          !values.tieneCalefaccion ? 'text-gray-400' : ''
                        }`}
                        value={values.marcaCalefaccion}
                        onChangeText={handleChange('marcaCalefaccion')}
                        onBlur={handleBlur('marcaCalefaccion')}
                        placeholder="Ej: Hayward"
                        editable={values.tieneCalefaccion}
                        placeholderTextColor={
                          !values.tieneCalefaccion ? '#a3a3a3' : '#9CA3AF'
                        }
                      />
                      {values.tieneCalefaccion &&
                        touched.marcaCalefaccion &&
                        errors.marcaCalefaccion && (
                          <Text className="text-red-500 mt-2">
                            {errors.marcaCalefaccion}
                          </Text>
                        )}

                      <Text
                        className={`font-geist text-text text-base mt-3 ${
                          !values.tieneCalefaccion ? 'text-gray-300' : ''
                        }`}
                      >
                        Modelo
                      </Text>
                      <TextInput
                        className={`border border-gray-200 rounded-md py-4 px-3 ${
                          !values.tieneCalefaccion ? 'text-gray-400' : ''
                        }`}
                        value={values.modeloCalefaccion}
                        onChangeText={handleChange('modeloCalefaccion')}
                        onBlur={handleBlur('modeloCalefaccion')}
                        placeholder="Ej: EnergyLine Pro"
                        editable={values.tieneCalefaccion}
                        placeholderTextColor={
                          !values.tieneCalefaccion ? '#a3a3a3' : '#9CA3AF'
                        }
                      />
                      {values.tieneCalefaccion &&
                        touched.modeloCalefaccion &&
                        errors.modeloCalefaccion && (
                          <Text className="text-red-500 mt-2">
                            {errors.modeloCalefaccion}
                          </Text>
                        )}

                      <Text
                        className={`font-geist text-text text-base mt-3 ${
                          !values.tieneCalefaccion ? 'text-gray-300' : ''
                        }`}
                      >
                        Potencia (kW)
                      </Text>
                      <TextInput
                        className={`border border-gray-200 rounded-md py-4 px-3 ${
                          !values.tieneCalefaccion ? 'text-gray-400' : ''
                        }`}
                        value={values.potenciaCalefaccion}
                        onChangeText={handleChange('potenciaCalefaccion')}
                        onBlur={handleBlur('potenciaCalefaccion')}
                        keyboardType="numeric"
                        placeholder="Ej: 13.5"
                        editable={values.tieneCalefaccion}
                        placeholderTextColor={
                          !values.tieneCalefaccion ? '#a3a3a3' : '#9CA3AF'
                        }
                      />
                      {values.tieneCalefaccion &&
                        touched.potenciaCalefaccion &&
                        errors.potenciaCalefaccion && (
                          <Text className="text-red-500 mt-2">
                            {errors.potenciaCalefaccion}
                          </Text>
                        )}
                    </View>
                  </View>

                  {/* Padding inferior para dar espacio sobre los botones fijos */}
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
                    className="border-2 border-navy-unique rounded-md py-3 items-center justify-center bg-gold-unique shadow-sm"
                    containerClassName="w-1/3"
                  >
                    <Text className="text-black text-base font-geist-semi-bold">
                      Agregar
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

export default CalefaccionNuevaPiscina;
