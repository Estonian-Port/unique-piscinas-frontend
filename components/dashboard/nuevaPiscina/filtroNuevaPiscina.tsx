import { View, Text, TextInput, Platform, Keyboard } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import RadioButton from '../../utiles/radioButton';
import DropDownPicker from 'react-native-dropdown-picker';
import { Link } from 'expo-router';
import PasosFormulario from './pasosFormulario';
import { FiltroNuevo, PiscinaNueva } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomPressable from '@/components/utiles/customPressable';

export type TipoFiltro = 'Arena' | 'Vidrio' | 'Cartucho';

const validationSchema = Yup.object().shape({
  tipoFiltro: Yup.string().required('Seleccione un tipo de filtro'),
  marcaFiltro: Yup.string().required('Ingrese la marca del filtro'),
  modeloFiltro: Yup.string().required('Ingrese el modelo del filtro'),
  diametro: Yup.number()
    .required('Ingrese el diámetro del filtro')
    .typeError('El diámetro debe ser un número')
    .min(0.1, 'El diámetro debe ser mayor que 0'),
  datoExtra: Yup.number()
    .required('Este campo es obligatorio para este tipo de filtro')
    .typeError('El valor debe ser un número')
    .min(0.1, 'El valor debe ser mayor que 0'),
  tiempoDeVidaUtil: Yup.number()
    .required('Ingrese el tiempo de vida útil del filtro')
    .typeError('El tiempo de vida útil debe ser un número')
    .min(1, 'El tiempo de vida útil debe ser mayor que 0'),
});

interface FormValues {
  tipoFiltro: string;
  marcaFiltro: string;
  modeloFiltro: string;
  diametro: string;
  datoExtra: string;
  tiempoDeVidaUtil: string;
}

const FiltroNuevaPiscina = ({
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
    const filtroExistente = nuevaPiscina.filtro;
    return {
      tipoFiltro: filtroExistente?.tipo ?? 'Arena',
      marcaFiltro: filtroExistente?.marca ?? '',
      modeloFiltro: filtroExistente?.modelo ?? '',
      diametro: filtroExistente?.diametro
        ? filtroExistente.diametro.toString()
        : '',
      datoExtra: filtroExistente?.datoExtra
        ? filtroExistente.datoExtra.toString()
        : '',
      tiempoDeVidaUtil: filtroExistente?.tiempoDeVidaUtil
        ? filtroExistente.tiempoDeVidaUtil.toString()
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
          const filtroNuevo: FiltroNuevo = {
            id: null,
            tipo: values.tipoFiltro as TipoFiltro,
            marca: values.marcaFiltro,
            modelo: values.modeloFiltro,
            diametro: Number(values.diametro),
            datoExtra: values.datoExtra ? Number(values.datoExtra) : 0,
            tiempoDeVidaUtil: values.tiempoDeVidaUtil
              ? Number(values.tiempoDeVidaUtil)
              : 0,
          };

          setNuevaPiscina({
            ...nuevaPiscina,
            filtro: filtroNuevo,
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
          }, [values.tipoFiltro, validateForm]);

          return (
            <>
              <KeyboardAwareScrollView
                ref={scrollViewRef}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === 'ios' ? 150 : 100}
                extraHeight={Platform.OS === 'ios' ? 150 : 200}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: keyboardOpen ? 100 : 50 }}
                enableResetScrollToCoords={false}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                <View className="py-5 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-geist-semi-bold text-text text-xl">
                      Equipamiento
                    </Text>
                    <PasosFormulario paso={4} />
                  </View>

                  <Text className="font-geist-semi-bold text-text text-lg mt-2">
                    Filtro
                  </Text>
                  <Text className="font-geist-semi-bold text-text text-base mt-3">
                    Tipo de filtro
                  </Text>

                  <RadioButton
                    value={'Arena'}
                    label={'Arena'}
                    selected={values.tipoFiltro === 'Arena'}
                    onPress={(value) => {
                      setFieldValue('tipoFiltro', value);
                      setFieldTouched('tipoFiltro', true);
                    }}
                  />
                  <RadioButton
                    value={'Vidrio'}
                    label={'Vidrio'}
                    selected={values.tipoFiltro === 'Vidrio'}
                    onPress={(value) => {
                      setFieldValue('tipoFiltro', value);
                      setFieldTouched('tipoFiltro', true);
                    }}
                  />
                  <RadioButton
                    value={'Cartucho'}
                    label={'Cartucho'}
                    selected={values.tipoFiltro === 'Cartucho'}
                    onPress={(value) => {
                      setFieldValue('tipoFiltro', value);
                      setFieldTouched('tipoFiltro', true);
                    }}
                  />

                  {touched.tipoFiltro && errors.tipoFiltro && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.tipoFiltro}
                    </Text>
                  )}

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
                    value={values.diametro}
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
                    value={values.datoExtra}
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

                  <Text className="font-geist text-text text-base mt-3">
                    Tiempo de vida útil aproximado en años
                  </Text>
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.tiempoDeVidaUtil}
                    onChangeText={handleChange('tiempoDeVidaUtil')}
                    onBlur={handleBlur('tiempoDeVidaUtil')}
                    keyboardType="numeric"
                    placeholder="Ej: 3"
                    placeholderTextColor="#9CA3AF"
                  />
                  {errors.tiempoDeVidaUtil && touched.tiempoDeVidaUtil && (
                    <Text className="text-red-500 text-sm mt-1">
                      {errors.tiempoDeVidaUtil}
                    </Text>
                  )}

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

export default FiltroNuevaPiscina;
