import React from 'react';
import { View } from 'react-native';

type DividerProps = {
  className?: string; // permite classes de nativewind como 'bg-gray-200 h-px my-4'
  inset?: number; // margen izquierdo en px
};

/**
 * Divider simple usando nativewind (className).
 * - Por defecto: bg-gray-200 h-px my-2 w-full
 * - Puedes pasar className para ajustar colores/tamaño/espaciado
 * - inset aplica marginLeft en px (útil para divisores "indented")
 */
export default function Divider({ className = 'bg-gray-200 h-px my-5 w-full', inset = 0 }: DividerProps) {
  return <View className={className} style={inset ? { marginLeft: inset } : undefined} />;
}