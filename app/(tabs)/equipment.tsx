import { View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { ScreenTabs } from '@/components/utiles/Screen';
import EquipamientoConfigurado from '@/components/equipamiento/equipamientoConfigurado';
import EstadoSistema from '@/components/equipamiento/estadoSistema';
import { piscinaService } from '@/services/piscina.service';
import { PiscinaEquipamiento } from '@/data/domain/piscina';
import PrivateScreen from '@/components/utiles/privateScreen';
import { useAuth } from '@/context/authContext';
import WebTabBar from '@/components/utiles/webTabBar';
import Header from '@/components/utiles/header';
import { useFocusEffect } from 'expo-router';

const Equipment = () => {
  const { usuario, selectedPool } = useAuth();
  const [piscina, setPiscina] = useState<PiscinaEquipamiento | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchPool = useCallback(async () => {
    if (!selectedPool?.id) return;

    try {
      setLoading(true);
      const data = await piscinaService.getPiscinaEquipamientoById(
        selectedPool.id
      );
      setPiscina(data);
    } catch (error) {
      console.error('Error al cargar el equipamiento de la piscina:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPool?.id]);

  useFocusEffect(
    useCallback(() => {
      fetchPool();
    }, [fetchPool])
  );

  if (loading || !usuario || !selectedPool || !piscina) {
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
            <Header usuario={usuario!} piscina={selectedPool!} />
            <WebTabBar />
            <EstadoSistema pool={piscina!} />
            <EquipamientoConfigurado pool={piscina!} />
          </View>
        </ScreenTabs>
      </ScrollView>
    </PrivateScreen>
  );
};

export default Equipment;
