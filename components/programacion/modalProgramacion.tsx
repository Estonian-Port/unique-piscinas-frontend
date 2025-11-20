import React from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Programacion,
  Day,
  ProgramacionType,
  localTimeStringToDate,
  dateToLocalTimeString,
} from '@/data/domain/cicloFiltrado';
import TimeInput from '../utiles/timeInput';
import * as Yup from 'yup';
import { Formik } from 'formik';
import CustomPressable from '../utiles/customPressable';

const validationSchema = Yup.object().shape({
  dias: Yup.array().min(1, 'Selecciona al menos un día'),
  horaInicio: Yup.date().required('Requerido'),
  horaFin: Yup.date()
    .required('Requerido')
    .test(
      'is-after',
      'El horario de fin debe ser posterior al de inicio',
      function (value) {
        const { horaInicio } = this.parent;
        return value > horaInicio;
      }
    ),
});

type ModalProgramacionProps = {
  visible: boolean;
  onClose: () => void;
  onSave: (cicle: Programacion) => void;
  hasCicleMode: boolean;
  cicle: Programacion;
};

const ModalProgramacion = ({
  visible,
  onClose,
  onSave,
  hasCicleMode,
  cicle,
}: ModalProgramacionProps) => {

  const daysOfWeek: Day[] = [
    Day.LUNES,
    Day.MARTES,
    Day.MIERCOLES,
    Day.JUEVES,
    Day.VIERNES,
    Day.SABADO,
    Day.DOMINGO,
  ];

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Formik
        initialValues={{
          dias: cicle.dias,
          horaInicio: localTimeStringToDate(cicle.horaInicio),
          horaFin: localTimeStringToDate(cicle.horaFin),
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          const cicloActualizado: Programacion = {
            ...cicle,
            dias: values.dias,
            horaInicio: dateToLocalTimeString(values.horaInicio),
            horaFin: dateToLocalTimeString(values.horaFin),
            tipo: ProgramacionType.FILTRADO,
          };
          if (!hasCicleMode) {
            cicloActualizado.tipo = ProgramacionType.ILUMINACION;
          }
          onSave(cicloActualizado);
          onClose();
        }}
      >
        {({
          handleSubmit,
          values,
          errors,
          touched,
          setFieldValue,
        }) => {
          const toggleDay = (day: Day): void => {
            if (values.dias.includes(day)) {
              setFieldValue(
                'dias',
                values.dias.filter((d: Day) => d !== day)
              );
            } else {
              setFieldValue('dias', [...values.dias, day]);
            }
          };

          const isDaySelected = (day: Day): boolean => {
            return values.dias.includes(day);
          };
          return (
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              style={{ flex: 1 }}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
                  <View className="flex-row items-center justify-between mb-4">
                    {daysOfWeek.map((day) => (
                      <Pressable
                        key={day}
                        className={`items-center justify-center rounded-sm p-1 px-2.5 border border-purple-unique ${
                          isDaySelected(day) ? 'bg-purple-unique' : 'bg-white'
                        }`}
                        onPress={() => toggleDay(day)}
                      >
                        <Text
                          className={`font-geist-semi-bold text-lg ${
                            isDaySelected(day) ? 'text-white' : 'text-black'
                          }`}
                        >
                          {day}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                  {touched.dias && errors.dias && (
                    <Text className="text-red-500 text-sm mb-2 text-center">
                      {errors.dias}
                    </Text>
                  )}
                  <View className="flex-row justify-around w-full mb-3">
                    <TimeInput
                      title="Hora inicio"
                      timeSchedule={values.horaInicio}
                      onChange={(date) => setFieldValue('horaInicio', date)}
                    />
                    <TimeInput
                      title="Hora fin"
                      timeSchedule={values.horaFin}
                      onChange={(date) => setFieldValue('horaFin', date)}
                    />
                  </View>
                  {touched.horaFin && typeof errors.horaFin === 'string' && (
                    <Text className="text-red-500 text-sm mb-2 text-center">
                      {errors.horaFin}
                    </Text>
                  )}

                  <View className="flex-row justify-between mt-3">
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
                      className="bg-purple-unique rounded-lg items-center justify-center h-12"
                      containerClassName='w-1/2'
                    >
                        <Text className="text-white text-center font-geist-semi-bold ml-1">
                          Guardar
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

export default ModalProgramacion;
