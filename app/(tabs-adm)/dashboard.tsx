import {
  ActivityIndicator,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScreenTabs } from '@/components/utiles/Screen';
import StatCard from '@/components/dashboard/statCard';
import PiscinasRegistradas from '@/components/dashboard/piscinasRegistradas';
import { useAuth } from '@/context/authContext';
import { StatDashboard } from '@/data/domain/stat';
import { administracionService } from '@/services/administracion.service';
import { PiscinaRegistrada as PiscinaRegistrada } from '@/data/domain/piscina';
import PrivateScreen from '@/components/utiles/privateScreen';
import WebTabBar from '@/components/utiles/webTabBar';
import CustomPressable from '@/components/utiles/customPressable';

const Dashboard = () => {
  const { usuario } = useAuth();
  const [stats, setStats] = useState<StatDashboard>();
  const [loading, setLoading] = useState(true);
  const [piscinasRegistradas, setPiscinasRegistradas] = useState<
    PiscinaRegistrada[]
  >([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await administracionService.getEstadisticas(usuario!.id);
        setStats(data);
      } catch (error) {
        console.error('Error cargando las estadísticas:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchPiscinas = async () => {
      try {
        const data = await administracionService.getPiscinasRegistradas(
          usuario!.id
        );
        setPiscinasRegistradas(data);
      } catch (error) {
        console.error('Error cargando las piscinas registradas:', error);
      }
    };

    if (usuario) {
      fetchStats();
      fetchPiscinas();
    }
  }, [usuario]);

  if (loading || !stats) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <PrivateScreen>
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
    </PrivateScreen>
  );
};

export default Dashboard;
