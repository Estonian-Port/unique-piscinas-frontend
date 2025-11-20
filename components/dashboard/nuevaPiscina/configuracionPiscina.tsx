import {
  View,
  Text,
  Pressable,
  TextInput,
  Platform,
  Keyboard,
} from 'react-native';
import React, { useRef, useEffect, useState } from 'react';
import Checkbox from 'expo-checkbox';
import { Link } from 'expo-router';
import PasosFormulario from './pasosFormulario';
import { PiscinaNueva } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik, FormikProps } from 'formik';
import { FastForward } from 'react-native-feather';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomPressable from '@/components/utiles/customPressable';

const validationSchema = Yup.object().shape({
  largo: Yup.number()
    .required('El largo es obligatorio')
    .typeError('El valor debe ser un número')
    .min(0.1, 'El largo debe ser mayor que 0'),
  ancho: Yup.number()
    .required('El ancho es obligatorio')
    .typeError('El valor debe ser un número')
    .min(0.1, 'El ancho debe ser mayor que 0'),
  profundidad: Yup.number()
    .required('La profundidad es obligatoria')
    .typeError('El valor debe ser un número')
    .min(0.1, 'La profundidad debe ser mayor que 0'),
  volumen: Yup.number()
    .required('El volumen es obligatorio')
    .typeError('El valor debe ser un número')
    .min(0.1, 'El volumen debe ser mayor que 0'),
  desbordante: Yup.boolean(),
  volumenTC: Yup.number().when('desbordante', {
    is: true,
    then: (schema) =>
      schema
        .required('El volumen T.C. es obligatorio')
        .typeError('El valor debe ser un número')
        .min(0.1, 'El volumen T.C. debe ser mayor que 0'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

interface FormValues {
  largo: string;
  ancho: string;
  profundidad: string;
  volumen: string;
  desbordante: boolean;
  volumenTC: string;
}

const ConfiguracionPiscina = ({
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
    return {
      largo: nuevaPiscina.largo ? nuevaPiscina.largo.toString() : '',
      ancho: nuevaPiscina.ancho ? nuevaPiscina.ancho.toString() : '',
      profundidad: nuevaPiscina.profundidad
        ? nuevaPiscina.profundidad.toString()
        : '',
      volumen: nuevaPiscina.volumen ? nuevaPiscina.volumen.toString() : '',
      desbordante: nuevaPiscina.esDesbordante ?? false,
      volumenTC: nuevaPiscina.volumenTC
        ? nuevaPiscina.volumenTC.toString()
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
          setNuevaPiscina({
            ...nuevaPiscina,
            largo: parseFloat(values.largo),
            ancho: parseFloat(values.ancho),
            profundidad: parseFloat(values.profundidad),
            volumen: parseFloat(values.volumen),
            esDesbordante: values.desbordante,
            volumenTC: values.desbordante ? parseFloat(values.volumenTC) : 0,
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
          validateForm,
        }) => {
          // Efecto para revalidar cuando cambia desbordante
          useEffect(() => {
            validateForm();
          }, [values.desbordante, validateForm]);

          const calcularVolumen = () => {
            const { largo, ancho, profundidad } = values;
            if (largo && ancho && profundidad) {
              const largoNum = parseFloat(largo);
              const anchoNum = parseFloat(ancho);
              const profundidadNum = parseFloat(profundidad);

              if (
                !isNaN(largoNum) &&
                !isNaN(anchoNum) &&
                !isNaN(profundidadNum) &&
                largoNum > 0 &&
                anchoNum > 0 &&
                profundidadNum > 0
              ) {
                const volumenNum = largoNum * anchoNum * profundidadNum;
                setFieldValue('volumen', volumenNum.toFixed(2));
              }
            }
          };

          return (
            <>
              <KeyboardAwareScrollView
                ref={scrollViewRef}
                enableOnAndroid={true}
                enableAutomaticScroll={true}
                extraScrollHeight={Platform.OS === 'ios' ? 50 : 50}
                extraHeight={Platform.OS === 'ios' ? 10 : 100}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1, paddingBottom: keyboardOpen ? 100 : 0 }}
                enableResetScrollToCoords={false}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              >
                <View className="py-5 flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="font-geist-semi-bold text-text text-xl">
                      Dimensiones
                    </Text>
                    <PasosFormulario paso={2} />
                  </View>

                  <View className="flex-row items-center mt-4">
                    <Checkbox
                      value={values.desbordante}
                      onValueChange={(value) => {
                        setFieldValue('desbordante', value);
                        if (!value) {
                          setFieldValue('volumenTC', '');
                        }
                      }}
                      color={values.desbordante ? '#0F0D23' : undefined}
                    />
                    <Pressable
                      onPress={() => {
                        const newValue = !values.desbordante;
                        setFieldValue('desbordante', newValue);
                        if (!newValue) {
                          setFieldValue('volumenTC', '');
                        }
                      }}
                      className="ml-2 flex-1"
                    >
                      <Text className="font-geist text-text text-base">
                        Piscina desbordante
                      </Text>
                      <Text className="font-geist-light text-text text-sm">
                        Piscina de tipo desbordante o infinity
                      </Text>
                    </Pressable>
                  </View>

                  <Text className="font-geist text-text text-base mt-3">
                    Largo (m)
                  </Text>
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.largo}
                    onChangeText={handleChange('largo')}
                    onBlur={handleBlur('largo')}
                    keyboardType="numeric"
                    placeholder="Ej: 10"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.largo && errors.largo && (
                    <Text className="text-red-500 mt-2">{errors.largo}</Text>
                  )}

                  <Text className="font-geist text-text text-base mt-3">
                    Ancho (m)
                  </Text>
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.ancho}
                    onChangeText={handleChange('ancho')}
                    onBlur={handleBlur('ancho')}
                    keyboardType="numeric"
                    placeholder="Ej: 5"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.ancho && errors.ancho && (
                    <Text className="text-red-500 mt-2">{errors.ancho}</Text>
                  )}

                  <Text className="font-geist text-text text-base mt-3">
                    Profundidad (m)
                  </Text>
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.profundidad}
                    onChangeText={handleChange('profundidad')}
                    onBlur={handleBlur('profundidad')}
                    keyboardType="numeric"
                    placeholder="Ej: 1.5"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.profundidad && errors.profundidad && (
                    <Text className="text-red-500 mt-2">
                      {errors.profundidad}
                    </Text>
                  )}

                  <View className="flex-row items-center justify-between mt-3 mb-1.5">
                    <Text className="font-geist text-text text-base">
                      Volumen (m³)
                    </Text>
                    <CustomPressable
                      className="p-2 border border-gray-200 rounded-md flex-row items-center justify-center gap-2"
                      onPress={calcularVolumen}
                    >
                      <FastForward />
                      <Text className="font-geist text-text">Calcular</Text>
                    </CustomPressable>
                  </View>

                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                    value={values.volumen}
                    onChangeText={handleChange('volumen')}
                    onBlur={handleBlur('volumen')}
                    keyboardType="numeric"
                    placeholder="Ej: 75"
                    placeholderTextColor="#9CA3AF"
                  />
                  {touched.volumen && errors.volumen && (
                    <Text className="text-red-500 mt-2">{errors.volumen}</Text>
                  )}

                  {values.desbordante && (
                    <>
                      <Text className="font-geist text-text text-base mt-3">
                        Volumen T.C. (m³)
                      </Text>
                      <TextInput
                        className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                        value={values.volumenTC}
                        onChangeText={handleChange('volumenTC')}
                        onBlur={handleBlur('volumenTC')}
                        keyboardType="numeric"
                        placeholder="Ej: 15"
                        placeholderTextColor="#9CA3AF"
                      />
                      {touched.volumenTC && errors.volumenTC && (
                        <Text className="text-red-500 mt-2">
                          {errors.volumenTC}
                        </Text>
                      )}
                    </>
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

export default ConfiguracionPiscina;
