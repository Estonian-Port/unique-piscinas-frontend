import { Image, Pressable } from 'react-native';
import React from 'react';
import { router } from 'expo-router';
import { useAuth } from '@/context/authContext';

const LogoUniqueHeader = () => {
  const { usuario } = useAuth();

  const handlePress = () => {
    if (!usuario) return;

    const { rol, piscinasId, primerLogin } = usuario;

    if (rol === 'ADMIN') {
      router.replace('/dashboard');
      return;
    }

    if (rol === 'PAT_GEN') {
      return;
    }

    if (rol === 'USER' && primerLogin) {
            return;
    }
    
    if (rol === 'USER' && !primerLogin) {
      const count = (piscinasId?.length ?? 0);
      if (count > 1) {
        router.replace('/pools');
      } else if (count === 1) {
        router.replace('/resume');
      } else {
        return;
      }
    }
  };

  return (
    <Pressable onPress={handlePress}>
      <Image
        source={require('../../assets/images/logo-unique-encabezado.png')}
        resizeMode="contain"
        style={{ width: 100, height: 25 }}
      />
    </Pressable>
  );
};

export default LogoUniqueHeader;