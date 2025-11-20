import { View } from 'react-native';
import React from 'react';
import { useAuth } from '@/context/authContext';
import LogoUniqueHeader from './logoUniqueHeader';
import BotonPerfil from './botonPerfil';

const NavBar = () => {
  const { usuario: user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
      <LogoUniqueHeader />
      <View className="flex-row items-center">
        {!user.primerLogin && <BotonPerfil nombreUsuario={user.nombre} />}
      </View>
    </View>
  );
};

export default NavBar;
