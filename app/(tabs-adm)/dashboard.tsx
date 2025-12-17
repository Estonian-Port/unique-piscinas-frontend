import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ScreenTabs } from '@/components/utiles/Screen';
import StatCard from '@/components/dashboard/statCard';
import PiscinasRegistradas from '@/components/dashboard/piscinasRegistradas';
import { useAuth } from '@/context/authContext';
import { StatDashboard } from '@/data/domain/stat';
import { administracionService } from '@/services/administracion.service';
import { PiscinaRegistrada as PiscinaRegistrada } from '@/data/domain/piscina';
import PrivateScreen from '@/components/utiles/privateScreen';
import WebTabBar from '@/components/utiles/webTabBar';
import { useFocusEffect } from 'expo-router';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState<StatDashboard>();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [piscinasRegistradas, setPiscinasRegistradas] = useState<
    PiscinaRegistrada[]
  >([]);

  const hasLoadedRef = useRef(false);

  const fetchData = useCallback(
    async (isInitialLoad = false) => {
      if (!usuario) return;

      if (isInitialLoad) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      try {
        const [estadisticas, piscinas] = await Promise.all([
          administracionService.getEstadisticas(usuario.id),
          administracionService.getPiscinasRegistradas(usuario.id),
        ]);

        setStats(estadisticas);
        setPiscinasRegistradas(piscinas);
      } catch (error) {
        console.error('Error cargando datos en focus:', error);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [usuario]
  );

  // Carga inicial solo una vez
  useEffect(() => {
    if (!hasLoadedRef.current) {
      hasLoadedRef.current = true;
      fetchData(true);
    }
  }, [fetchData]);

  // Refrescar cuando la pantalla obtiene foco
  useFocusEffect(
    useCallback(() => {
      // Solo refrescar si ya se hizo la carga inicial
      if (hasLoadedRef.current) {
        fetchData(false);
      }
    }, [fetchData])
  );

  // Pull to refresh
  const onRefresh = useCallback(() => {
    fetchData(false);
  }, [fetchData]);

  if (loading || !stats) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <PrivateScreen>
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={0}
        extraHeight={0}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
        enableResetScrollToCoords={false}
        scrollEnabled={true}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView className="flex-1 bg-white">
          <ScreenTabs>
            <View className="w-11/12">
              <Text className="self-start font-geist-bold text-3xl text-text m-5">
                Panel de Administración
              </Text>

              <WebTabBar isAdmin={true} />

              {Platform.OS === 'web' ? (
                <View className="grid grid-cols-3 gap-3">
                  <StatCard
                    title="Usuarios"
                    value={stats.totalUsuarios}
                    label={`${stats.usuariosActivos} activos, ${stats.usuariosInactivos} inactivos, ${stats.usuariosPendientes} pendientes`}
                    icon="people"
                  />
                  <StatCard
                    title="Piscinas"
                    value={stats.totalPiscinas}
                    label={`${stats.piscinasSkimmer} skimmer, ${stats.piscinasDesborde} desborde`}
                    icon="water-drop"
                  />
                  <StatCard
                    title="Volumen Total"
                    value={stats.volumenTotal}
                    label={`Promedio: ${stats.volumenPromedio} m³ por piscina`}
                    icon="water"
                    unity="m³"
                  />
                </View>
              ) : (
                <>
                  <StatCard
                    title="Usuarios"
                    value={stats.totalUsuarios}
                    label={`${stats.usuariosActivos} activos, ${stats.usuariosInactivos} inactivos, ${stats.usuariosPendientes} pendientes`}
                    icon="people"
                  />
                  <StatCard
                    title="Piscinas"
                    value={stats.totalPiscinas}
                    label={`${stats.piscinasSkimmer} skimmer, ${stats.piscinasDesborde} desborde`}
                    icon="water-drop"
                  />
                  <StatCard
                    title="Volumen Total"
                    value={stats.volumenTotal}
                    label={`Promedio: ${stats.volumenPromedio} m³ por piscina`}
                    icon="water"
                    unity="m³"
                  />
                </>
              )}

              <PiscinasRegistradas pools={piscinasRegistradas} />
            </View>
          </ScreenTabs>
        </ScrollView>
      </KeyboardAwareScrollView>
    </PrivateScreen>
  );
};

export default Dashboard;
