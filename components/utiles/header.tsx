import React from 'react';
import { View, Text } from 'react-native';
import BotonCambio from './botonCambio';
import { UsuarioLogin } from '@/data/domain/user';
import { PiscinaListItem } from '@/data/domain/piscina';

type HeaderProps = {
  usuario: UsuarioLogin
  piscina: PiscinaListItem
};

const Header = ({ usuario, piscina }: HeaderProps) => {
  return (
    <>
      <View className="w-11/12 my-3">
        <Text className="font-geist-bold text-2xl text-text">
          Hola, {usuario.nombre}. Bienvenido!
        </Text>
      </View>
      <View className="flex-row content-around mb-3 w-full">
        <View className="flex-1 pr-4">
          <Text className="font-geist-semi-bold text-xl text-text">
            {piscina.direccion}
          </Text>
          <Text className="font-geist text-base text-text">
            Volumen de la piscina: {piscina.volumen} m3
          </Text>
        </View>
        {usuario.piscinasId.length > 1 && usuario.rol !== 'ADMIN' && <BotonCambio />}
      </View>
    </>
  );
};

export default Header;
