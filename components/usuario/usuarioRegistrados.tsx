import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react'; // Añadir useState
import { ScreenCard } from '../utiles/ScreenCard';
import UserItem from './userItem';
import { administracionService } from '@/services/administracion.service';
import { useAuth } from '@/context/authContext';
import { UsuarioRegistrado } from '@/data/domain/user';

const UsuarioRegistrados = ({ refreshKey }: { refreshKey: number }) => {
  const { usuario } = useAuth();
  const [users, setUsers] = useState<UsuarioRegistrado[]>([]);
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const response = await administracionService.getUsuariosRegistrados(
        usuario!.id
      );
      setUsers(response);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [refreshKey]);

  const handleToggleExpand = (userId: number) => {
    setExpandedUserId(expandedUserId === userId ? null : userId);
  };

  return (
    <ScreenCard>
      <View className="mb-3">
        <Text className="font-geist-semi-bold text-text text-3xl">
          Usuarios Registrados
        </Text>
        <Text className="font-geist-light text-text text-base">
          Gestion de usuarios y sus piscinas
        </Text>
      </View>
      {users.map((user) => (
        <UserItem
          key={user.id}
          usuario={user}
          isExpanded={expandedUserId === user.id}
          onToggleExpand={() => handleToggleExpand(user.id)}
          onActualizarPiscinasAsignadas={fetchData}
        />
      ))}
    </ScreenCard>
  );
};

export default UsuarioRegistrados;
