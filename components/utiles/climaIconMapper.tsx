import { Cloud, CloudLightning, CloudRain, Sun } from 'lucide-react-native';

export const climaIconComponent = (estado: string) => {
  const iconSize = 40;

  switch (estado) {
    case 'SOLEADO':
      return <Sun width={iconSize} height={iconSize} color="#F19E39" />;
    case 'PARCIAL':
      return <Cloud width={iconSize} height={iconSize} color="#7D7D7D" />;
    case 'NUBLADO':
      return <Cloud width={iconSize} height={iconSize} color="#0F0F0F" />;
    case 'LLUVIA':
      return <CloudRain width={iconSize} height={iconSize} color="#4A90E2" />;
    case 'TORMENTA':
      return <CloudLightning width={iconSize} height={iconSize} color="#2C3E50" />;
    default:
      return <Sun width={iconSize} height={iconSize} color="#000" />;
  }
};

export const climaIconColor = (estado: string): string => {
  switch (estado) {
    case 'SOLEADO':
      return '#F19E39';
    case 'PARCIAL':
      return '#7D7D7D';
    case 'NUBLADO':
      return '#7D7D7D';
    case 'LLUVIA':
      return '#4A90E2';
    case 'TORMENTA':
      return '#2C3E50';
    default:
      return '#000';
  }
};

export const climaStatusLabel = (estado: string): string => {
  switch (estado) {
    case 'SOLEADO':
      return 'Soleado';
    case 'PARCIAL':
      return 'Parcialmente nublado';
    case 'NUBLADO':
      return 'Nublado';
    case 'LLUVIA':
      return 'Lluvia';
    case 'TORMENTA':
      return 'Tormenta';
    default:
      return 'Desconocido';
  }
};