import {
  View,
  Text,
  Switch,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { GermicidaNuevo, PiscinaEquipos } from '@/data/domain/piscina';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Toast from 'react-native-toast-message';
import { piscinaService } from '@/services/piscina.service';
import { Zap } from 'react-native-feather';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  uvMarca: Yup.string().required('Seleccione una marca de lámpara UV'),
  uvPotencia: Yup.number()
    .required('Ingrese la potencia')
    .typeError('La potencia debe ser un número')
    .min(1, 'La potencia debe ser mayor que 0'),
  uvTiempoVidaUtil: Yup.number()
    .required('Ingrese el tiempo de vida útil del UV')
    .typeError('El tiempo de vida útil debe ser un número')
    .min(1, 'El tiempo de vida útil debe ser mayor que 0'),
});

const ModalAgregarUV = ({
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
  const sistemaGermicida = piscina.sistemasGermicidas || [];
  const uvExistente = sistemaGermicida.find((s) => s.tipo === 'uv');

  const handleNewUV = async (newUV: GermicidaNuevo) => {
    try {
      const response = await piscinaService.addGermicida(piscina.id, newUV);
      actualizarPiscina(); // Actualiza la piscina después de agregar el germicida
      Toast.show({
        type: 'success',
        text1: 'UV agregado',
        text2: response.message || 'El UV se ha agregado correctamente.',
        position: 'bottom',
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Hubo un problema al agregar el UV. Inténtelo de nuevo.',
        position: 'bottom',
      });
      console.error('Error adding UV:', error);
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
          uvSwitch: !!uvExistente,
          uvMarca: uvExistente?.marca ?? '',
          uvPotencia: uvExistente?.datoExtra
            ? uvExistente.datoExtra.toString()
            : '',
          uvTiempoVidaUtil: uvExistente?.vidaRestante.toString() ?? '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const newUV: GermicidaNuevo = {
            id: null,
            tipo: 'UV',
            marca: values.uvMarca,
            datoExtra: Number(values.uvPotencia),
            activa: true,
            tiempoVidaUtil: Number(values.uvTiempoVidaUtil),
          };
          handleNewUV(newUV);
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
                      <Zap height={18} width={18} color={'green'} />
                      <Text className="text-text text-base font-geist ml-1">
                        Lámpara UV
                      </Text>
                    </View>

                    <View className="items-start w-full">
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

export default ModalAgregarUV;
