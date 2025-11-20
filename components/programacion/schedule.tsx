import { View, Text, Pressable, Switch } from 'react-native';
import React, { useState } from 'react';
import {
  Programacion,
  Day,
  ProgramacionType,
} from '@/data/domain/cicloFiltrado';
import ModalProgramacion from './modalProgramacion';
import ModalEliminarProgramacion from './modalEliminarProgramacion';
import { Clock, Delete, Edit2 } from 'react-native-feather';

const Schedule = ({
  cicle,
  editCicle,
  deleteCicle,
  activarCicle,
  desactivarCicle,
}: {
  cicle: Programacion;
  editCicle: (cicloEditado: Programacion) => void;
  deleteCicle: (cicloId: number) => void;
  activarCicle: (cicloId: number) => void;
  desactivarCicle: (cicloId: number) => void;
}) => {
  const daysOfWeek: Day[] = [
    Day.LUNES,
    Day.MARTES,
    Day.MIERCOLES,
    Day.JUEVES,
    Day.VIERNES,
    Day.SABADO,
    Day.DOMINGO,
  ];
  const [isActive, setIsActive] = useState(cicle.activa);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const isActiveDay = (day: Day) => {
    return cicle.dias.includes(day);
  };

  const deleteSchedule = () => {
    deleteCicle(cicle.id!!);
    setOpenModalDelete(false);
  };

  const cambiarEstado = (nuevoEstado: boolean) => {
    setIsActive(nuevoEstado);
    if (nuevoEstado) {
      activarCicle(cicle.id!!);
    } else {
      desactivarCicle(cicle.id!!);
    }
  };

  return (
    <View
      className={`w-full rounded-md p-2 border ${
        cicle.ejecutando ? 'border-yellow-400' : 'bg-white border-gray-200'
      }`}
    >
      <View className="flex-row flex-1 justify-between">
        <View className="flex-row items-center">
          <Clock height={14} width={14} color="black" />
          <Text
            className={`text-text text-sm mx-2 ${
              cicle.ejecutando ? 'font-geist-bold' : 'font-geist'
            }`}
          >
            {cicle.horaInicio} - {cicle.horaFin} horas
          </Text>
        </View>
        {cicle.tipo === ProgramacionType.FILTRADO && (
          <View className="flex-row items-center justify-center border border-gray-200 rounded-xl p-0.5">
            <Text className="font-geist text-text text-sm mx-1">Filtrar</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center justify-between flex-1">
        <View className="flex-row items-center justify-between flex-1">
          {daysOfWeek.map((day) => (
            <View
              key={day}
              className={`flex-row items-center flex-1 justify-center rounded-sm mx-0.5 p-0.5 border border-purple-unique ${
                isActiveDay(day) ? 'bg-purple-unique' : 'bg-white'
              } ${isActive ? '' : 'opacity-50'}`}
            >
              <Text
                className={`font-geist-semi-bold text-base ${
                  isActiveDay(day) ? 'text-white' : 'text-black'
                }`}
              >
                {day}
              </Text>
            </View>
          ))}
        </View>
        <View className="flex-row items-center justify-around gap-3">
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#000000' }}
            thumbColor={isActive ? '#fcdb99' : '#ffffff'}
            ios_backgroundColor="#d3d3d3"
            onValueChange={() => cambiarEstado(!isActive)}
            value={isActive}
          />
          <Pressable onPress={() => setOpenModalEdit(!openModalEdit)}>
            <Edit2 color="black" />
          </Pressable>
          {openModalEdit && (
            <ModalProgramacion
              visible={openModalEdit}
              onClose={() => setOpenModalEdit(false)}
              onSave={editCicle}
              hasCicleMode={cicle.tipo === ProgramacionType.FILTRADO}
              cicle={cicle}
            />
          )}
          <Pressable onPress={() => setOpenModalDelete(true)}>
            <Delete color="red" />
          </Pressable>
          {openModalDelete && (
            <ModalEliminarProgramacion
              visible={openModalDelete}
              onClose={() => setOpenModalDelete(false)}
              onDelete={deleteSchedule}
            />
          )}
        </View>
      </View>
    </View>
  );
};

export default Schedule;
