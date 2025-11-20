import { View, Text } from 'react-native';
import React from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { PiscinaEquipamiento } from '@/data/domain/piscina';
import BombaCard from './bombaEquipamiento';
import FiltroCard from './filtroEquipamiento';
import GermicidaEquipamiento from './germicidaEquipamiento';
import { Filter, Info, Power, Settings } from 'react-native-feather';
import Divider from '../utiles/divider';

const EquipamientoConfigurado = ({ pool }: { pool: PiscinaEquipamiento }) => {
  const requiereAtencion = pool.sistemasGermicidas.some(
    (germicida) => germicida.estado !== 'Operativo'
  );

  return (
    <ScreenCard>
      <View className="flex-row items-center self-start mb-3">
        <Settings />
        <Text className="font-geist-semi-bold text-text text-2xl ml-2">
          Equipamiento configurado
        </Text>
      </View>

      <View className="flex-row items-center self-start my-2">
        <Power color={'#60C3FF'} />
        <Text className="font-geist-semi-bold text-text text-lg ml-2">
          Bombas
        </Text>
      </View>
      {pool.bombas.map((bomba) => (
        <BombaCard
          key={bomba.id}
          bomba={bomba}
          esBombaPrincipal={bomba.id === pool.bombas[0].id}
        />
      ))}

      <View className="flex-row items-center self-start my-2">
        <Filter color={'#60C3FF'} />
        <Text className="font-geist-semi-bold text-text text-lg ml-2">
          Filtro
        </Text>
      </View>
      <FiltroCard filtro={pool.filtro} />

      {pool.sistemasGermicidas.length > 0 && <Divider />}

      {pool.sistemasGermicidas.map((germicida) => (
        <GermicidaEquipamiento key={germicida.id} germicida={germicida} />
      ))}

      {requiereAtencion && (
        <View className="flex-row w-full items-center rounded-md bg-yellow-100 p-2 mt-3 gap-2 border-l-4 border-orange-300">
          <Info color={'orange'} />
          <Text className="font-geist text-text text-sm flex-shrink">
            Algunos sistemas germicidas requieren atención. Revise el estado de los
            componentes marcados.
          </Text>
        </View>
      )}
    </ScreenCard>
  );
};

export default EquipamientoConfigurado;
