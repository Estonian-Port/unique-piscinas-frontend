import { climaService } from '@/services/clima.service';
import { ClimaResponse } from '@/services/clima.service';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { ScreenTabs } from '@/components/utiles/Screen';
import Indicadores from '@/components/resume/indicadores';
import ControlFiltro from '@/components/resume/controlFiltro';
import PhClimaCard from '@/components/resume/phClimaCard';
import { piscinaService } from '@/services/piscina.service';
import { PiscinaResume } from '@/data/domain/piscina';
import PrivateScreen from '@/components/utiles/privateScreen';
import { useAuth } from '@/context/authContext';
import WebTabBar from '@/components/utiles/webTabBar';
import Header from '@/components/utiles/header';
import {
  climaIconColor,
  climaIconComponent,
} from '@/components/utiles/climaIconMapper';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import BombasExtra from '@/components/resume/bombasExtra';

export default function Resume() {
  const { usuario, selectedPool } = useAuth();
  const [piscina, setPiscina] = useState<PiscinaResume | null>(null);
  const [loading, setLoading] = useState(true);
  const [clima, setClima] = useState<ClimaResponse | null>(null);

  const hasLoadedRef = useRef(false);

  const fetchData = useCallback(
    async (isInitialLoad = false) => {
      if (!selectedPool) return;

      try {
        // Solo mostrar loading completo en la carga inicial
        if (isInitialLoad) {
          setLoading(true);
        }

        const [poolData, poolPh, climaData] = await Promise.all([
          piscinaService.getPiscinaResume(selectedPool.id),
          piscinaService.getPiscinaResumePhById(selectedPool.id),
          climaService.getClima(),
        ]);

        setPiscina({ ...poolData, ...poolPh });
        setClima(climaData);
        if (isInitialLoad) {
          hasLoadedRef.current = true;
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        if (isInitialLoad) {
          setLoading(false);
        }
      }
    },
    [selectedPool]
  );

  // Carga inicial solo una vez
  useEffect(() => {
    if (!hasLoadedRef.current && selectedPool) {
      hasLoadedRef.current = true;
      fetchData(true);
    }
  }, [fetchData, selectedPool]);

  // Refrescar cuando la pantalla obtiene foco (sin loading completo)
  useFocusEffect(
    useCallback(() => {
      if (hasLoadedRef.current && selectedPool) {
        fetchData(false);
      }
    }, [fetchData, selectedPool])
  );

  // Resetear cuando cambia la piscina seleccionada
  useEffect(() => {
    hasLoadedRef.current = false;
  }, [selectedPool?.id]);

  if (loading || !usuario || !selectedPool || !piscina || !clima) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  const tieneBombasExtra = piscina.bombas.some(
    (bomba) => bomba.tipo === 'Hidromasaje' || bomba.tipo === 'Cascada'
  );
  const bombasExtra = piscina.bombas
    .filter((bomba) => bomba.tipo === 'Hidromasaje' || bomba.tipo === 'Cascada')
    .sort((a, b) => {
      const order = ['Cascada', 'Hidromasaje'];
      return order.indexOf(a.tipo) - order.indexOf(b.tipo);
    });

  const icono = climaIconComponent(clima.estadoClima);
  const color = climaIconColor(clima.estadoClima);

  return (
    <PrivateScreen>
      <ScrollView className="flex-1 bg-white">
        <ScreenTabs>
          <View className="w-11/12">
            <Header usuario={usuario} piscina={selectedPool} />
            <WebTabBar />

            <PhClimaCard
              ph={piscina.ph}
              diferenciaPh={piscina.diferenciaPh}
              temperature={clima.temperatura}
              weatherIcon={icono}
              colorIcon={color}
              location={'Buenos Aires, Argentina'}
              weatherStatus={clima.estadoClima}
              humidity={clima.humedad}
              wind={12}
            />

            <ControlFiltro
              piscina={piscina}
              setPiscina={setPiscina}
              entradaAgua={piscina.entradaAgua}
              funcionFiltro={piscina.funcionActiva}
              onUpdate={fetchData}
            />
            <Indicadores piscina={piscina} />
            {tieneBombasExtra && (
              <BombasExtra
                bombas={bombasExtra}
                poolId={piscina.id}
                onUpdate={fetchData}
              />
            )}
          </View>
        </ScreenTabs>
      </ScrollView>
    </PrivateScreen>
  );
}
