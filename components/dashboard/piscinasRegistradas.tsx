import { View, Text, TextInput, ScrollView, Platform } from 'react-native';
import React, { useState } from 'react';
import { ScreenCard } from '../utiles/ScreenCard';
import { Link } from 'expo-router';
import PoolTableCard from './cardPiscinaTabla';
import { PiscinaRegistrada } from '@/data/domain/piscina';
import CustomPressable from '../utiles/customPressable';

const PiscinasRegistradas = ({pools} : {pools: PiscinaRegistrada[]}) => {
  const [searchQuery, setSearchQuery] = useState("")

  // Filtrar piscinas según la búsqueda
  const filteredPools = pools.filter(
    (pool) =>
      pool.direccion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pool.nombreAdministrador.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <ScreenCard>
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-text font-geist-semi-bold text-2xl">
          Piscinas Registradas
        </Text>
        <Link asChild href="/nuevaPiscina">

        {Platform.OS === "web" ? (
          <CustomPressable className="border rounded-md bg-[#222247] items-center justify-center">
              <Text className="text-white font-geist-semi-bold text-center py-2 px-4">+  Nueva Piscina</Text>
          </CustomPressable>
        ) : (
          <CustomPressable className="border rounded-md bg-[#222247] w-12 h-12 items-center justify-center">
              <Text className="text-white font-geist-bold text-xl text-center">+</Text>
          </CustomPressable>
        )}
        </Link>
      </View>

      <TextInput
        className="border rounded-lg p-2 bg-white text-base border-gray-300 mb-5 "
        placeholder="Buscar piscina por nombre o propietario"
        placeholderTextColor="#9CA3AF"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        autoCapitalize="none"
      />

      <ScrollView className="flex-1">
        {filteredPools.map((pool) => (
          <PoolTableCard key={pool.id} pool={pool} />
        ))}

        {filteredPools.length === 0 && (
          <View className="items-center justify-center py-10">
            <Text className="text-gray-500 font-geist text-base">No se encontraron piscinas</Text>
          </View>
        )}
      </ScrollView>
    </ScreenCard>
  );
};

export default PiscinasRegistradas;
