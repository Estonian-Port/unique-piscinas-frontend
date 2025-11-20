import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { UsuarioPendiente } from '@/data/domain/user';
import { administracionService } from '@/services/administracion.service';
import { ScreenCard } from '../utiles/ScreenCard';
import { ref } from 'yup';

const UsuariosPendientes = ({ refreshKey }: { refreshKey: number }) => {
  const { usuario } = useAuth();
  const [users, setUsers] = useState<UsuarioPendiente[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await administracionService.getUsuariosPendientes(
          usuario!.id
        );
        setUsers(response);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [refreshKey]);

  return (
    <ScreenCard>
      <View className="mb-3">
        <Text className="font-geist-semi-bold text-text text-3xl">
          Usuarios Pendientes
        </Text>
        <Text className="font-geist-light text-text text-base">
          Invitaciones enviadas por email
        </Text>
      </View>
      {users.map((user) => (
        <View
          className="flex-row justify-between items-center py-4 border-b border-gray-200"
          key={user.id}
        >
          <View>
            <Text className="font-geist-semi-bold text-text text-base">
              {user.email}
            </Text>
            <Text className="font-geist text-gray-500 text-sm">
              Invitación enviada el {user.fechaAlta}
            </Text>
          </View>
          <View className="items-center justify-between gap-3 rounded-full px-2 py-1 bg-gray-300 border border-gray-400">
            <Text className="font-geist-semi-bold text-text text-sm text-center">
              Pendiente
            </Text>
          </View>
        </View>
      ))}
    </ScreenCard>
  );
};

export default UsuariosPendientes;
