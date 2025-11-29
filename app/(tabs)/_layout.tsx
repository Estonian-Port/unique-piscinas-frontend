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
        name="resume"
        options={{
          title: 'Detalles',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="article" title="Detalles" />
          ),
        }}
      />
      <Tabs.Screen
        name="equipment"
        options={{
          title: 'Equipos',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="tune" title="Equipamiento" />
          ),
        }}
      />
      <Tabs.Screen
        name="programation"
        options={{
          title: 'Programación',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="calendar-month"
              title="Programación"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="faq"
        options={{
          title: 'FAQ',
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon="live-help" title="FAQ" />
          ),
        }}
      />
    </Tabs>
  );
};

export default _Layout;
