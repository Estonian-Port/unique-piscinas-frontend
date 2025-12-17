import { View, Text, Pressable } from 'react-native';
import React, { useState } from 'react';
import {
  AlertCircle,
  Calendar,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
  Droplet,
  Zap,
} from 'lucide-react-native';
import { Lectura } from '@/app/lecturas';

// Función para formatear fecha y hora
const formatearFechaHora = (fechaStr: string) => {
  try {
    const fecha = new Date(fechaStr);
    return {
      fecha: fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      hora: fecha.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  } catch (e) {
    return { fecha: fechaStr, hora: '' };
  }
};

// Función para obtener el color del pH
const obtenerColorPH = (ph: number) => {
  if (ph < 7.2) return '#F44336'; // Ácido - rojo
  if (ph > 7.8) return '#2196F3'; // Alcalino - azul
  return '#4CAF50'; // Ideal - verde
};

// Componente para mostrar un parámetro con valor y unidad
const ParametroItem = ({
  icono,
  label,
  valor,
  unidad,
  color = '#666',
}: {
  icono: React.ReactNode;
  label: string;
  valor: string | number;
  unidad?: string;
  color?: string;
}) => (
  <View className="bg-gray-50 p-3 rounded-lg flex-1 mx-1">
    <View className="flex-row items-center mb-1">
      {icono}
      <Text className="text-gray-500 text-xs ml-1">{label}</Text>
    </View>
    <View className="flex-row items-baseline justify-center">
      <Text className="font-geist-semi-bold text-base" style={{ color }}>
        {valor}
      </Text>
      {unidad && <Text className="text-gray-500 text-xs ml-1">{unidad}</Text>}
    </View>
  </View>
);

// Componente para mostrar estado de equipos
const EstadoEquipo = ({
  nombre,
  estado,
}: {
  nombre: string;
  estado: 'Encendida' | 'Apagada' | 'Encendido' | 'Apagado';
}) => {
  const isActive = estado === 'Encendida' || estado === 'Encendido';
  const color = isActive ? '#4CAF50' : '#BDBDBD';

  return (
    <View className="flex-row items-center bg-gray-50 p-2 rounded-lg flex-1 mx-1">
      <View
        className="h-3 w-3 rounded-full mr-2"
        style={{ backgroundColor: color }}
      />
      <View className="flex-1">
        <Text className="text-gray-500 text-xs">{nombre}</Text>
        <Text className="font-geist-semi-bold text-sm" style={{ color }}>
          {estado}
        </Text>
      </View>
    </View>
  );
};

// Componente LecturaCard con tu estilo original
const LecturaCard = ({ lectura }: { lectura: Lectura }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { fecha, hora } = formatearFechaHora(lectura.fecha);
  const colorPH = obtenerColorPH(lectura.ph);

  // Cambia el fondo y borde según si es error
  const cardBg = lectura.esError ? 'bg-red-50 border-red-300' : 'bg-white border-gray-100';

  return (
    <View className={`rounded-xl p-4 shadow-sm border mb-4 ${cardBg}`}>
      {/* Encabezado con fecha y hora */}
      <Pressable
        onPress={() => setIsExpanded(!isExpanded)}
        className={`flex-row items-center justify-between ${
          isExpanded ? 'mb-4 pb-3 border-b border-gray-100' : ''
        }`}
      >
        <View className="flex-row items-center">
          <Calendar height={16} width={16} color={lectura.esError ? "#E53935" : "#666"} className="mr-2" />
          <Text className={`font-geist-semi-bold text-lg ${lectura.esError ? "text-red-700" : "text-gray-800"}`}>
            {fecha}
          </Text>
        </View>
        <View className="flex-row items-center">
          <Clock height={16} width={16} color={lectura.esError ? "#E53935" : "#666"} className="mr-2" />
          <Text className={`text-md ${lectura.esError ? "text-red-600" : "text-gray-600"}`}>{hora}</Text>
        </View>
        {isExpanded ? (
          <ChevronUp height={16} width={16} color={lectura.esError ? "#E53935" : "#333"} />
        ) : (
          <ChevronDown height={16} width={16} color={lectura.esError ? "#E53935" : "#333"} />
        )}
      </Pressable>

      {isExpanded && (
        lectura.esError ? (
          <View className="flex-row items-center mt-2">
            <AlertCircle height={24} width={24} color="#E53935" />
            <View className="ml-3 flex-1">
              <Text className="font-geist-bold text-red-700 text-base mb-1">
                Lectura con error
              </Text>
              <Text className="text-red-600 text-xs">
                No se pudieron obtener los datos de la piscina.
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* Parámetros químicos principales */}
            <Text className="text-gray-700 font-geist-semi-bold text-sm mb-3">
              Datos de la piscina
            </Text>
            <View className="flex-row mb-4">
              <ParametroItem
                icono={<Droplet height={14} width={14} color={colorPH} />}
                label="pH"
                valor={lectura.ph}
                color={colorPH}
              />
              <ParametroItem
                icono={<Droplet height={14} width={14} color="#2196F3" />}
                label="Cloro"
                valor={lectura.cloro}
                unidad="ppm"
                color="#2196F3"
              />
              <ParametroItem
                icono={<Zap height={14} width={14} color="#FF9800" />}
                label="Redox"
                valor={lectura.redox}
                unidad="mV"
                color="#FF9800"
              />
              <ParametroItem
                icono={<Circle height={14} width={14} color="#9C27B0" />}
                label="Presión"
                valor={lectura.presion}
                unidad="bar"
                color="#9C27B0"
              />
            </View>
          </>
        )
      )}
    </View>
  );
};

export default LecturaCard;
