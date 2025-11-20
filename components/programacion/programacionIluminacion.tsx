import { View, Text, Switch } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  dateToLocalTimeString,
  Programacion,
  ProgramacionType,
} from '@/data/domain/cicloFiltrado';
import { ScreenCard } from '../utiles/ScreenCard';
import Schedule from './schedule';
import ModalProgramacion from './modalProgramacion';
import Toast from 'react-native-toast-message';
import { useAuth } from '@/context/authContext';
import { Clock, Sliders } from 'react-native-feather';
import CustomPressable from '../utiles/customPressable';
import { estadoPiscinaService } from '@/services/estadoPiscina.service';
import { programacionService } from '@/services/programacion.service';

const ProgramacionIluminacion = ({
  programacion,
  actualizarPiscina,
  luzManual,
}: {
  programacion: Programacion[];
  actualizarPiscina: () => Promise<void>;
  luzManual: boolean;
}) => {
  const { selectedPool } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [localLuzManual, setLocalLuzManual] = useState<boolean>(!!luzManual);

  // sincronizar cuando la prop cambie (ej. al refetch desde padre)
  useEffect(() => {
    setLocalLuzManual(!!luzManual);
  }, [luzManual]);

  const programacionVacia: Programacion = {
    id: null,
    horaInicio: dateToLocalTimeString(new Date()),
    horaFin: dateToLocalTimeString(new Date()),
    dias: [],
    activa: true,
    tipo: ProgramacionType.ILUMINACION,
    ejecutando: false,
  };

  const hasCicles = programacion.length > 0;

  const handleLucesManual = async (value: boolean) => {
    if (!selectedPool) return;
    // optimista: actualizar UI inmediatamente
    setLocalLuzManual(value);

    try {
      if (value) {
        await estadoPiscinaService.encenderLucesManual(selectedPool.id);
        Toast.show({
          type: 'success',
          text1: 'Luces activadas',
          position: 'bottom',
          bottomOffset: 80,
        });
      } else {
        await estadoPiscinaService.apagarLucesManual(selectedPool.id);
        Toast.show({
          type: 'success',
          text1: 'Luces desactivadas',
          position: 'bottom',
          bottomOffset: 80,
        });
      }

      // recargar datos desde el padre para que todo el UI refleje el estado real
      await actualizarPiscina();
    } catch (error) {
      // revertir el estado local en caso de error
      setLocalLuzManual(!value);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: value
          ? 'No se han podido activar las luces'
          : 'No se han podido desactivar las luces',
        position: 'bottom',
        bottomOffset: 80,
      });
      console.error('Error toggling luces manual:', error);
    }
  };

  const handleAddCicle = async (nuevoCiclo: Programacion) => {
    try {
      const response = await programacionService.addProgramacion(
        selectedPool!.id,
        nuevoCiclo
      );
      Toast.show({
        type: 'success',
        text1: 'Ciclo añadido',
        text2: 'El ciclo se ha añadido correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
      actualizarPiscina();
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding cycle:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El ciclo no se ha podido añadir correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  const handleEditCicle = async (cicloEditado: Programacion) => {
    try {
      const response = await programacionService.updateProgramacion(
        selectedPool!.id,
        cicloEditado
      );
      Toast.show({
        type: 'success',
        text1: 'Ciclo editado',
        text2: 'El ciclo se ha editado correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
      actualizarPiscina();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No se ha podiado editar el ciclo de programación',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  const handleDeleteCicle = async (cicloId: number) => {
    try {
      const response = await programacionService.deleteProgramacion(
        selectedPool!.id,
        cicloId
      );
      Toast.show({
        type: 'success',
        text1: 'Ciclo eliminado',
        text2: 'El ciclo se ha eliminado correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
      actualizarPiscina();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El ciclo no se ha podido eliminar correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  const handleActivarCicle = async (cicloId: number) => {
    try {
      const response = await programacionService.activarProgramacion(
        selectedPool!.id,
        cicloId
      );
      Toast.show({
        type: 'success',
        text1: 'Ciclo activado',
        text2: 'El ciclo se ha activado correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
      actualizarPiscina();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El ciclo no se ha podido activar correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  const handleDesactivarCicle = async (cicloId: number) => {
    try {
      const response = await programacionService.desactivarProgramacion(
        selectedPool!.id,
        cicloId
      );
      Toast.show({
        type: 'success',
        text1: 'Ciclo desactivado',
        text2: 'El ciclo se ha desactivado correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
      actualizarPiscina();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'El ciclo no se ha podido desactivar correctamente',
        position: 'bottom',
        bottomOffset: 80,
      });
    }
  };

  return (
    <ScreenCard>
      <View className="flex-row items-center  mb-4">
        <Clock color="orange" />
        <Text className="font-geist-semi-bold text-text text-2xl ml-1">
          Control de Iluminación
        </Text>
      </View>

      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center">
          <Sliders color="light-blue" />
          <Text className="font-geist-semi-bold text-text text-base ml-1">
            Control Manual
          </Text>
        </View>
        <Switch
          trackColor={{ false: '#d3d3d3', true: '#000000' }}
          thumbColor={localLuzManual ? '#fcdb99' : '#ffffff'}
          ios_backgroundColor="#d3d3d3"
          onValueChange={(value) => handleLucesManual(value)}
          value={localLuzManual}
        />
      </View>

      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <Clock color="light-blue" />
          <Text className="font-geist-semi-bold text-text text-base ml-1">
            Horarios programados
          </Text>
        </View>
        <CustomPressable
          className="border border-gray-200 rounded-md p-2 items-center justify-center"
          onPress={() => setModalVisible(true)}
        >
          <Text className="font-geist text-text text-base">+ Añadir</Text>
        </CustomPressable>
        <ModalProgramacion
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleAddCicle}
          cicle={programacionVacia}
          hasCicleMode={false}
        />
      </View>

      {hasCicles ? (
        <View className="items-center justify-between gap-2">
          {programacion.map((ciclo) => (
            <Schedule
              cicle={ciclo}
              key={ciclo.id}
              editCicle={handleEditCicle}
              deleteCicle={handleDeleteCicle}
              activarCicle={handleActivarCicle}
              desactivarCicle={handleDesactivarCicle}
            />
          ))}
        </View>
      ) : (
        <View className="flex-row items-center justify-center mt-4 mb-4">
          <Text className="font-geist-semi-bold text-text text-base text-center">
            No hay horarios programados.{'\n'}
            Presione el botón +Añadir para agregar uno.
          </Text>
        </View>
      )}
    </ScreenCard>
  );
};

export default ProgramacionIluminacion;
