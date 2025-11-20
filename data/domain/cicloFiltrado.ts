export enum ProgramacionType {
  FILTRADO = 'Filtrado',
  ILUMINACION = 'Iluminacion',
}

export interface Programacion {
  id: number | null;
  horaInicio: string;
  horaFin: string;
  dias: Day[];
  activa: boolean;
  tipo: ProgramacionType;
  ejecutando: boolean;
}

export enum FuncionFiltro {
  FILTRAR = 'Filtrar',
  RETROLAVAR = 'Retrolavar',
  DESAGOTAR = 'Desagotar',
  RECIRCULAR = 'Recircular',
  ENJUAGAR = 'Enjuagar',
}

export enum Day {
  LUNES = 'L',
  MARTES = 'M',
  MIERCOLES = 'X',
  JUEVES = 'J',
  VIERNES = 'V',
  SABADO = 'S',
  DOMINGO = 'D',
}

export const dayMap: Record<string, string> = {
  L: 'MONDAY',
  M: 'TUESDAY',
  X: 'WEDNESDAY',
  J: 'THURSDAY',
  V: 'FRIDAY',
  S: 'SATURDAY',
  D: 'SUNDAY',
};

// Función para mapear los valores del backend al enum del frontend
function funcionFiltroFromDto(value: string): FuncionFiltro {
  switch (value) {
    case 'FILTRAR':
      return FuncionFiltro.FILTRAR;
    case 'RETROLAVAR':
      return FuncionFiltro.RETROLAVAR;
    case 'DESAGOTAR':
      return FuncionFiltro.DESAGOTAR;
    case 'RECIRCULAR':
      return FuncionFiltro.RECIRCULAR;
    case 'ENJUAGAR':
      return FuncionFiltro.ENJUAGAR;
    default:
      return value as FuncionFiltro;
  }
}

function tipoFromDto(value: string): ProgramacionType {
  switch (value) {
    case 'FILTRADO':
      return ProgramacionType.FILTRADO;
    case 'ILUMINACION':
      return ProgramacionType.ILUMINACION;
    default:
      return value as ProgramacionType;
  }
}

function dayFromDto(value: string): Day {
  switch (value) {
    case 'MONDAY':
      return Day.LUNES;
    case 'TUESDAY':
      return Day.MARTES;
    case 'WEDNESDAY':
      return Day.MIERCOLES;
    case 'THURSDAY':
      return Day.JUEVES;
    case 'FRIDAY':
      return Day.VIERNES;
    case 'SATURDAY':
      return Day.SABADO;
    case 'SUNDAY':
      return Day.DOMINGO;
    default:
      throw new Error(`Día no reconocido: ${value}`);
  }
}

export function localTimeStringToDate(str: string): Date {
  const [hour, minute] = str.split(':').map(Number);
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

export function dateToLocalTimeString(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0');
  const m = date.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

// Función para mapear un objeto Programacion del backend
export function programacionFromDto(p: any): Programacion {
  return {
    ...p,
    dias: p.dias ? p.dias.map(dayFromDto) : [],
    funcionFiltro: p.funcionFiltro
      ? funcionFiltroFromDto(p.funcionFiltro)
      : null,
    tipo: tipoFromDto(p.tipo),
  };
}
