import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image } from 'react-native';
import { Screen } from '@/components/utiles/Screen';
import { router } from 'expo-router';
import { useAuth } from '@/context/authContext';
import ModalLogout from '@/components/utiles/modalLogout';
import ModalEditarPerfil from '@/components/profile/modalEditarPerfil';
import ModalEditarPassword from '@/components/profile/modalEditarPassword';
import { Edit2, LogIn, LogOut } from 'react-native-feather';
import CustomPressable from '@/components/utiles/customPressable';

const Profile = () => {
  const { usuario: user, logout } = useAuth();
  const [modalLogoutVisible, setModalLogoutVisible] = useState(false);
  const [modalEditVisible, setModalEditVisible] = useState(false);
  const [modalPasswordVisible, setModalPasswordVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      router.replace('/login');
    }
  }, [user]);

  const handleLogout = async () => {
    setModalLogoutVisible(false);
    logout();
  };

  if (!user) return null;

  return (
    <ScrollView className="bg-white">
      <Screen>
        <Text className="font-geist-semi-bold text-2xl text-text mt-6 mb-4 self-center">
          Mi perfil
        </Text>
        <View className="items-center mb-6">
          <View className="border rounded-full border-gray-300 p-2 bg-white shadow">
            <Image
              source={require('../assets/images/logotipo-unique.png')}
              style={{ width: 100, height: 100, borderRadius: 50 }}
            />
          </View>
        </View>
        <View className="bg-gray-100 rounded-xl p-6 w-11/12 md:w-1/3 self-center mb-6 shadow">
          <Text className="font-geist-semi-bold text-lg text-text mb-4 text-center">
            Datos personales
          </Text>
          <View className="mb-2 flex-row justify-between">
            <Text className="font-geist text-gray-500">Nombre:</Text>
            <Text className="font-geist text-text">{user.nombre}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="font-geist text-gray-500">Apellido:</Text>
            <Text className="font-geist text-text">{user.apellido}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="font-geist text-gray-500">Email:</Text>
            <Text className="font-geist text-text">{user.email}</Text>
          </View>
          <View className="mb-2 flex-row justify-between">
            <Text className="font-geist text-gray-500">Celular:</Text>
            <Text className="font-geist text-text">{user.celular}</Text>
          </View>
        </View>
        <View className="w-11/12 md:w-1/3 self-center">
          <CustomPressable className="flex-row mt-2 rounded-lg bg-purple-unique p-4 w-full mb-2 justify-center"
          onPress={() => setModalEditVisible(true)}>
            <Edit2 color="#ffffff" />
            <Text className="ml-2 font-geist-semi-bold text-white text-lg text-center">
              Editar datos personales
            </Text>
          </CustomPressable>
          <CustomPressable className="rounded-lg bg-red-alert p-4 w-full mb-2" onPress={() => setModalPasswordVisible(true)}>
            <Text className="font-geist-semi-bold text-white text-lg text-center">
              Cambiar contraseña
            </Text>
          </CustomPressable>
          <CustomPressable
            className="flex-row items-center justify-center mt-6 rounded-lg p-4 w-full"
            onPress={() => setModalLogoutVisible(true)}
          >
            <LogOut color="#9ca3af" />
            <Text className="ml-2 font-geist-semi-bold text-gray-400 text-lg text-center">
              Cerrar sesión
            </Text>
          </CustomPressable>
        </View>
        <ModalLogout
          visible={modalLogoutVisible}
          message={'¿Desea cerrar sesión?'}
          onClose={() => setModalLogoutVisible(false)}
          onCerrarSesion={handleLogout}/>
        <ModalEditarPerfil
          visible={modalEditVisible}
          onClose={() => setModalEditVisible(false)}
        />
        <ModalEditarPassword
          visible={modalPasswordVisible}
          onClose={() => setModalPasswordVisible(false)}
        />
      </Screen>
    </ScrollView>
  );
};

export default Profile;
