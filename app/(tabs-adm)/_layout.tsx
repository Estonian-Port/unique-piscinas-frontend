import React from 'react';
import { Stack, Tabs } from 'expo-router';
import TabIcon from '../../components/utiles/tabIcon';
import { Platform } from 'react-native';

const _Layout = () => {
  return Platform.OS === 'web' ? (
    <Stack screenOptions={{ headerShown: false }} />
  ) : (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          height: 60,
          position: 'absolute',
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB', // Gris suave
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: 'hidden',
        },
        tabBarActiveTintColor: '#222247', // Color del icono activo
        tabBarInactiveTintColor: '#9CA3AF', // Color del icono inactivo
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="dashboard" title="Dashboard" />
          ),
        }}
      />
      <Tabs.Screen
        name="altaUsuario"
        options={{
          title: 'altaUsuario',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="people" title="Usuarios" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
