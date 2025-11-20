import React from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { Calefaccion, PiscinaEquipos } from '@/data/domain/piscina';
import Toast from 'react-native-toast-message';
import { piscinaService } from '@/services/piscina.service';
import CompuestosCard from './compuestosCard';

const TratamientoCard = ({
  orp,
  controlPH,
  cloroSalino,
  piscina,
  actualizarPiscina,
}: {
  orp: boolean;
  controlPH: boolean;
  cloroSalino: boolean;
  piscina: PiscinaEquipos;
  actualizarPiscina: () => Promise<void>;
}) => {
  return (
      <CompuestosCard
        orp={orp}
        controlPH={controlPH}
        cloroSalino={cloroSalino}
        onChange={(values) => {
          piscinaService
            .updateCompuestos(piscina.id, values)
            .then(() => {
              actualizarPiscina();
              Toast.show({
                type: 'success',
                text1: 'Compuestos actualizados',
                position: 'bottom',
              });
            })
            .catch(() => {
              Toast.show({
                type: 'error',
                text1: 'Error al actualizar los compuestos',
                text2: 'Intente nuevamente más tarde.',
                position: 'bottom',
              });
            });
        }}
      />
  );
};

export default TratamientoCard;
