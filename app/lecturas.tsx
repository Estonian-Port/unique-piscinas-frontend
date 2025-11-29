import { View, Text, ScrollView, Pressable } from 'react-native';
import React, { useState, useMemo, useEffect } from 'react';
import LecturaCard from '@/components/dashboard/lecturaCard';
import { ChevronsLeft, ChevronsRight } from 'react-native-feather';
import { piscinaService } from '@/services/piscina.service';
import { useAuth } from '@/context/authContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomPressable from '@/components/utiles/customPressable';

export type Lectura = {
  id: number;
  fecha: string;
  ph: number;
  cloro: number;
  redox: number;
  presion: number;
  esError: boolean;
};

// Función para generar los últimos 12 meses
const generarUltimos12Meses = () => {
  const meses = [];
  const ahora = new Date();

  for (let i = 0; i < 12; i++) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    meses.push({
      año: fecha.getFullYear(),
      mes: fecha.getMonth(),
      nombreMes: fecha.toLocaleDateString('es-ES', { month: 'long' }),
      clave: `${fecha.getFullYear()}-${fecha.getMonth()}`,
    });
  }

  return meses;
};

// Función para formatear el nombre del mes
const formatearMesAño = (año: number, mes: number) => {
  const fecha = new Date(año, mes, 1);
  return fecha
    .toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    })
    .replace(/^\w/, (c) => c.toUpperCase());
};

const HistorialLecturas = () => {
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const mesesDisponibles = generarUltimos12Meses();
  const [mesSeleccionado, setMesSeleccionado] = useState(mesesDisponibles[0]);
  const { selectedPool } = useAuth();
  const [loading, setLoading] = useState(true);
  const [filtroErrores, setFiltroErrores] = useState<
    'todas' | 'errores' | 'validas'
  >('todas');

  useEffect(() => {
    const fetchLecturas = async () => {
      try {
        setLoading(true);
        const lecturas = await piscinaService.getLecturas(selectedPool!.id);
        setLecturas(lecturas);
      } catch (error) {
        console.error('Error al cargar las lecturas:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLecturas();
  }, [selectedPool]);

  // Filtrar lecturas por mes y error
  const lecturasFiltradas = useMemo(() => {
    let filtradas = lecturas.filter((lectura) => {
      const fechaLectura = new Date(lectura.fecha);
      const mesLectura = fechaLectura.getMonth();
      const añoLectura = fechaLectura.getFullYear();
      return (
        mesLectura === mesSeleccionado.mes && añoLectura === mesSeleccionado.año
      );
    });
    if (filtroErrores === 'errores') {
      filtradas = filtradas.filter((lectura) => lectura.esError);
    } else if (filtroErrores === 'validas') {
      filtradas = filtradas.filter((lectura) => !lectura.esError);
    }
    return filtradas;
  }, [lecturas, mesSeleccionado, filtroErrores]);

  // Ordenar lecturas por fecha
  const lecturasOrdenadas = useMemo(() => {
    return [...lecturasFiltradas].sort((a, b) => {
      const dateA = new Date(a.fecha).getTime();
      const dateB = new Date(b.fecha).getTime();
      return sortDirection === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [lecturasFiltradas, sortDirection]);

  // Navegación entre meses
  const navegarMes = (direccion: 'anterior' | 'siguiente') => {
    const indiceActual = mesesDisponibles.findIndex(
      (m) => m.clave === mesSeleccionado.clave
    );
    if (
      direccion === 'anterior' &&
      indiceActual < mesesDisponibles.length - 1
    ) {
      setMesSeleccionado(mesesDisponibles[indiceActual + 1]);
    } else if (direccion === 'siguiente' && indiceActual > 0) {
      setMesSeleccionado(mesesDisponibles[indiceActual - 1]);
    }
  };

  const puedeIrAnterior =
    mesesDisponibles.findIndex((m) => m.clave === mesSeleccionado.clave) <
    mesesDisponibles.length - 1;
  const puedeIrSiguiente =
    mesesDisponibles.findIndex((m) => m.clave === mesSeleccionado.clave) > 0;

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 bg-gray-50 px-2 py-4 items-center justify-center"
        edges={['bottom']}
      >
        <Text className="text-gray-500 font-geist text-base mt-2">
          Cargando lecturas...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={['bottom']} // 👈 Solo proteger el bottom, no el top
    >
      {/* Header fijo */}
      <View className="px-4 pt-4 pb-3 bg-gray-50">
        <Text className="font-geist-semi-bold text-2xl text-gray-900 mb-1">
          {selectedPool?.direccion}
        </Text>
        <Text className="font-geist-semi-bold text-lg text-gray-900 mb-1">
          Historial de Lecturas
        </Text>
        <Text className="text-gray-500 text-sm mb-3">
          Mediciones de parámetros del agua por mes
        </Text>

        {/* Navegador de meses */}
        <View className="bg-white rounded-xl p-3 mb-3 border border-gray-200">
          <View className="flex-row items-center justify-between">
            <Pressable
              className={`p-2 rounded-lg ${
                puedeIrAnterior ? 'bg-blue-50' : 'bg-gray-100'
              }`}
              onPress={() => navegarMes('anterior')}
              disabled={!puedeIrAnterior}
            >
              <ChevronsLeft color={puedeIrAnterior ? '#2563eb' : '#9ca3af'} />
            </Pressable>
            <View className="flex-1 mx-3">
              <Text className="font-geist-semi-bold text-base text-gray-900 text-center">
                {formatearMesAño(mesSeleccionado.año, mesSeleccionado.mes)}
              </Text>
              <Text className="text-gray-500 text-xs text-center">
                {lecturasFiltradas.length} lecturas
              </Text>
            </View>
            <Pressable
              className={`p-2 rounded-lg ${
                puedeIrSiguiente ? 'bg-blue-50' : 'bg-gray-100'
              }`}
              onPress={() => navegarMes('siguiente')}
              disabled={!puedeIrSiguiente}
            >
              <ChevronsRight color={puedeIrSiguiente ? '#2563eb' : '#9ca3af'} />
            </Pressable>
          </View>
        </View>

        {/* Controles de filtrado - Layout vertical en pantallas pequeñas */}
        <View className="gap-3">
          {/* Ordenar */}
          <View>
            <Text className="font-geist text-gray-700 text-sm mb-1">
              Ordenar:
            </Text>
            <View className="flex-row border border-gray-200 rounded-lg overflow-hidden">
              <Pressable
                className={`flex-1 px-3 py-2 ${
                  sortDirection === 'desc' ? 'bg-blue-500' : 'bg-white'
                }`}
                onPress={() => setSortDirection('desc')}
              >
                <Text
                  className={`text-center text-sm ${
                    sortDirection === 'desc'
                      ? 'text-white font-geist-semi-bold'
                      : 'text-blue-500 font-geist'
                  }`}
                >
                  Más recientes
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 px-3 py-2 ${
                  sortDirection === 'asc' ? 'bg-blue-500' : 'bg-white'
                }`}
                onPress={() => setSortDirection('asc')}
              >
                <Text
                  className={`text-center text-sm ${
                    sortDirection === 'asc'
                      ? 'text-white font-geist-semi-bold'
                      : 'text-blue-500 font-geist'
                  }`}
                >
                  Más antiguos
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Filtrar por tipo */}
          <View>
            <Text className="font-geist text-gray-700 text-sm mb-1">
              Filtrar:
            </Text>
            <View className="flex-row border border-gray-200 rounded-lg overflow-hidden">
              <Pressable
                className={`flex-1 px-2 py-2 ${
                  filtroErrores === 'todas' ? 'bg-blue-500' : 'bg-white'
                }`}
                onPress={() => setFiltroErrores('todas')}
              >
                <Text
                  className={`text-center text-sm ${
                    filtroErrores === 'todas'
                      ? 'text-white font-geist-semi-bold'
                      : 'text-blue-500 font-geist'
                  }`}
                >
                  Todas
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 px-2 py-2 ${
                  filtroErrores === 'errores' ? 'bg-red-500' : 'bg-white'
                }`}
                onPress={() => setFiltroErrores('errores')}
              >
                <Text
                  className={`text-center text-sm ${
                    filtroErrores === 'errores'
                      ? 'text-white font-geist-semi-bold'
                      : 'text-red-500 font-geist'
                  }`}
                >
                  Erróneas
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 px-2 py-2 ${
                  filtroErrores === 'validas' ? 'bg-green-500' : 'bg-white'
                }`}
                onPress={() => setFiltroErrores('validas')}
              >
                <Text
                  className={`text-center text-sm ${
                    filtroErrores === 'validas'
                      ? 'text-white font-geist-semi-bold'
                      : 'text-green-500 font-geist'
                  }`}
                >
                  Válidas
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Lista scrolleable */}
      <ScrollView className="flex-1 px-4">
        {lecturasOrdenadas.length === 0 ? (
          <View className="items-center justify-center py-8">
            <Text className="text-gray-500 font-geist text-base">
              No hay lecturas para mostrar
            </Text>
          </View>
        ) : (
          lecturasOrdenadas.map((lectura, index) => (
            <LecturaCard key={index} lectura={lectura} />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HistorialLecturas;
