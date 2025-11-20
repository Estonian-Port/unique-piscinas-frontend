import {
  View,
  Text,
  TextInput,
  Platform,
  Pressable,
  Keyboard,
} from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { Link } from 'expo-router';
import PasosFormulario from './pasosFormulario';
import { PiscinaNueva } from '@/data/domain/piscina';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { administracionService } from '@/services/administracion.service';
import { UsuarioList } from '@/data/domain/user';
import { useAuth } from '@/context/authContext';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomPressable from '@/components/utiles/customPressable';

const validationSchema = Yup.object().shape({
  direccion: Yup.string().required('La dirección es obligatoria'),
  ciudad: Yup.string().required('La ciudad es obligatoria'),
  notas: Yup.string().max(100, 'Máximo 100 caracteres'),
  codigoPlaca: Yup.string()
    .required('El código de la placa es obligatorio')
    .length(4, 'Debe tener exactamente 4 caracteres'),
  administradorId: Yup.number().nullable(),
});

interface FormValues {
  direccion: string;
  ciudad: string;
  notas: string;
  administradorId: number | null;
  codigoPlaca: string;
}

const InformacionBasica = ({
  onCancel,
  onNext,
  nuevaPiscina,
  setNuevaPiscina,
}: {
  onCancel: () => void;
  onNext: () => void;
  nuevaPiscina: PiscinaNueva;
  setNuevaPiscina: (piscina: PiscinaNueva) => void;
}) => {
  const { usuario } = useAuth();
  const [usuarios, setUsuarios] = useState<UsuarioList[]>([]);
  const [openPatente, setOpenPatente] = useState(false);
  const [patenteItems, setPatenteItems] = useState<
    { label: string; value: string; key: string }[]
  >([]);
  const formikRef = useRef<FormikProps<FormValues>>(null);
  const [open, setOpen] = useState(false);
  const scrollViewRef = useRef<KeyboardAwareScrollView>(null);
  const notasInputRef = useRef<TextInput>(null);
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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await administracionService.getUsuarios(usuario!.id);
        setUsuarios(response);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    const fetchPatentes = async () => {
      try {
        const response = await administracionService.getPatentes();
        if (response.length === 0) {
          setPatenteItems([
            {
              label: 'No hay plaquetas disponibles',
              value: '',
              key: 'no-patentes',
            },
          ]);
        } else {
          setPatenteItems(
            response.map((patente) => ({
              label: patente,
              value: patente,
              key: patente,
            }))
          );
        }
      } catch (error) {
        console.error('Error fetching patentes:', error);
      }
    };
    fetchUsers();
    fetchPatentes();
  }, []);

  const [items, setItems] = useState<
    { label: string; value: number | undefined; key: string }[]
  >([
    {
      label: 'Asignar propietario más tarde',
      value: undefined,
      key: 'sin-propietario',
    },
  ]);

  useEffect(() => {
    setItems([
      {
        label: 'Asignar propietario más tarde',
        value: undefined,
        key: 'sin-propietario',
      },
      ...usuarios.map((usuario) => ({
        label: usuario.nombre + ' ' + usuario.apellido,
        value: usuario.id,
        key: `usuario-${usuario.id}`,
      })),
    ]);
  }, [usuarios]);

  const getInitialValues = (): FormValues => {
    return {
      direccion: nuevaPiscina.direccion ?? '',
      ciudad: nuevaPiscina.ciudad ?? '',
      notas: nuevaPiscina.notas ?? '',
      administradorId: nuevaPiscina.administradorId ?? null,
      codigoPlaca: nuevaPiscina.codigoPlaca,
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
            direccion: values.direccion,
            ciudad: values.ciudad,
            notas: values.notas,
            administradorId: values.administradorId,
            codigoPlaca: values.codigoPlaca,
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
        }) => (
          <>
            <KeyboardAwareScrollView
              ref={scrollViewRef}
              enableOnAndroid={true}
              enableAutomaticScroll={true}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}
              enableResetScrollToCoords={false}
              scrollEnabled={true}
              showsVerticalScrollIndicator={false}
            >
              <View className="pt-5">
                <View className="flex-row items-center justify-between">
                  <Text className="font-geist-semi-bold text-text text-xl">
                    Información Básica
                  </Text>
                  <PasosFormulario paso={1} />
                </View>

                <Text className="font-geist text-text text-base mt-3">
                  Propietario
                </Text>
                <DropDownPicker
                  open={open}
                  value={values.administradorId}
                  items={items}
                  setOpen={setOpen}
                  setValue={(callback) => {
                    const val = callback(values.administradorId);
                    setFieldValue('administradorId', val);
                  }}
                  setItems={setItems}
                  placeholder="Asignar un propietario más tarde"
                  zIndex={3000}
                  zIndexInverse={1000}
                  listMode="SCROLLVIEW"
                  style={{
                    borderColor: '#d1d5db',
                    borderWidth: 2,
                    borderRadius: 6,
                    backgroundColor: '#fff',
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#d1d5db',
                    borderWidth: 2,
                    borderRadius: 6,
                    backgroundColor: '#f3f4f6',
                  }}
                  selectedItemContainerStyle={{
                    backgroundColor: '#ede9fe',
                  }}
                  selectedItemLabelStyle={{
                    fontWeight: 'bold',
                    color: '#7c3aed',
                  }}
                  placeholderStyle={{
                    color: '#333333',
                  }}
                />

                <Text className="font-geist text-text text-base mt-3">
                  Dirección
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.direccion}
                  onChangeText={handleChange('direccion')}
                  onBlur={handleBlur('direccion')}
                  placeholder="Ej: Av San Martin 1234"
                  placeholderTextColor="#9CA3AF"
                />
                {touched.direccion && errors.direccion && (
                  <Text className="text-red-500 mt-2">{errors.direccion}</Text>
                )}

                <Text className="font-geist text-text text-base mt-3">
                  Ciudad
                </Text>
                <TextInput
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3"
                  value={values.ciudad}
                  onChangeText={handleChange('ciudad')}
                  onBlur={handleBlur('ciudad')}
                  placeholder="Ej: Buenos Aires"
                  placeholderTextColor="#9CA3AF"
                />
                {touched.ciudad && errors.ciudad && (
                  <Text className="text-red-500 mt-2">{errors.ciudad}</Text>
                )}

                <Text className="font-geist text-text text-base mt-3">
                  ID de la placa
                </Text>
                <DropDownPicker
                  open={openPatente}
                  value={values.codigoPlaca}
                  items={patenteItems}
                  setOpen={setOpenPatente}
                  setValue={(callback) => {
                    const val = callback(values.codigoPlaca);
                    setFieldValue('codigoPlaca', val);
                  }}
                  setItems={setPatenteItems}
                  placeholder="Selecciona una patente"
                  zIndex={2000}
                  zIndexInverse={1500}
                  listMode="SCROLLVIEW"
                  style={{
                    borderColor: '#d1d5db',
                    borderWidth: 2,
                    borderRadius: 6,
                    backgroundColor: '#fff',
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                  }}
                  dropDownContainerStyle={{
                    borderColor: '#d1d5db',
                    borderWidth: 2,
                    borderRadius: 6,
                    backgroundColor: '#f3f4f6',
                  }}
                  selectedItemContainerStyle={{
                    backgroundColor: '#ede9fe',
                  }}
                  selectedItemLabelStyle={{
                    fontWeight: 'bold',
                    color: '#7c3aed',
                  }}
                  placeholderStyle={{
                    color: '#333333',
                  }}
                />
                {touched.codigoPlaca && errors.codigoPlaca && (
                  <Text className="text-red-500 mt-2">
                    {errors.codigoPlaca}
                  </Text>
                )}

                <Text className="font-geist text-text text-base mt-3">
                  Notas adicionales
                </Text>
                <TextInput
                  ref={notasInputRef}
                  className="border-2 bg-white border-gray-300 rounded-md p-2 h-40"
                  value={values.notas}
                  onChangeText={handleChange('notas')}
                  onBlur={handleBlur('notas')}
                  onFocus={() => {
                    setTimeout(() => {
                      return scrollViewRef.current?.scrollToEnd(true);
                    }, 100);
                  }}
                  placeholder="Alguna información adicional que quieras agregar..."
                  placeholderTextColor="#9CA3AF"
                  multiline={true}
                  numberOfLines={6}
                  textAlignVertical="top"
                />
                {touched.notas && errors.notas && (
                  <Text className="text-red-500 mt-2">{errors.notas}</Text>
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
                    className="border-2 border-grayish-unique rounded-md items-center justify-center shadow-sm bg-white p-3"
                    containerClassName="w-1/2"
                  >
                    <Text className="text-text font-geist-semi-bold text-base">
                      Cancelar
                    </Text>
                  </CustomPressable>
                </Link>
                <CustomPressable
                  onPress={handleSubmit as any}
                  className="border-2 border-navy-unique rounded-md items-center justify-center bg-purple-unique shadow-sm p-3"
                  containerClassName="w-1/2"
                >
                  <Text className="text-white text-base font-geist-semi-bold">
                    Siguiente
                  </Text>
                </CustomPressable>
              </View>
            </View>
          </>
        )}
      </Formik>
    </View>
  );
};

export default InformacionBasica;
