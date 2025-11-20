import { Programacion } from './cicloFiltrado';
import { Usuario } from './user';

export interface PiscinaRegistrada {
  id: number;
  direccion: string;
  esDesbordante: boolean;
  nombreAdministrador: string;
  ph: number;
  sistemasGermicidas: Germicida[];
}

//Se usa en la vista ficha tecnica
export interface PiscinaFichaTecnica {
  id: number;
  direccion: string;
  ciudad: string;
  nombreAdministrador: string;
  codigoPlaca: number;
  esDesbordante: boolean;
  largo: number;
  ancho: number;
  profundidad: number;
  volumen: number;
  volumenTC: number | null;
  notas: string;
}



//Se usa en la vista de admin -> equipos
export interface PiscinaEquipos {
  id: number;
  direccion: string;
  bombas: Bomba[];
  filtro: Filtro;
  sistemasGermicidas: Germicida[];
  cloroSalino: boolean;
  controlAutomaticoPH: boolean;
  orp: boolean;
  calefaccion: Calefaccion | null;
  registros: Registro[];
}

//Se usa en la vista usuario -> programation
export interface PiscinaProgramacion {
  id: number;
  direccion: string;
  volumen: string;
  programacionIluminacion: Programacion[];
  programacionFiltrado: Programacion[];
  iluminacionManual: boolean;
}

//Se usa en la vista usuario -> equipment
export interface PiscinaEquipamiento {
  id: number;
  direccion: string;
  volumen: string;
  estadoFiltro: boolean;
  entradaAgua: entradaAgua[];
  funcionActiva: funcionFiltro;
  presion: number;
  ultimaActividad: string;
  proximoCiclo: string;
  bombas: Bomba[];
  filtro: Filtro;
  sistemasGermicidas: Germicida[];
}

export interface PiscinaListItem {
  id: number;
  direccion: string;
  volumen: number;
}

export interface PiscinaResume {
  id: number;
  direccion: string;
  volumen: string;
  clima: string;
  ph: number;
  diferenciaPh: number;
  entradaAgua: entradaAgua[];
  funcionActiva: funcionFiltro;
  sistemasGermicidas: Germicida[];
  calefaccion: Calefaccion | null;
  esDesbordante: boolean;
}

export class Piscina {
  id: number;
  propietario?: Usuario;
  name: string;
  volume: number;
  filtro?: Filtro;
  bombas: Bomba[];
  germicidas: Germicida[];
  calefaccion: Calefaccion;
  registro: Registro[];

  constructor(
    id: number,
    propietario: Usuario | undefined,
    name: string,
    volume: number,
    bombas: Bomba[],
    germicidas: Germicida[],
    calefaccion: Calefaccion,
    registro: Registro[]
  ) {
    this.id = id;
    this.propietario = propietario;
    this.name = name;
    this.volume = volume;
    this.bombas = bombas;
    this.germicidas = germicidas;
    this.calefaccion = calefaccion;
    this.registro = registro;
  }
}

export type Bomba = {
  id: number;
  marca: string;
  modelo: string;
  potencia: number;
  activa: boolean;
  tipo: string;
};

export type Filtro = {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  diametro: number;
  activo: boolean;
  datoExtra?: number;
  tiempoVidaUtil?: number;
  vidaRestante: string;
};

//Esto se usa para traer datos del back
export type Germicida = {
  id: number;
  tipo: string;
  marca: string;
  vidaRestante: string;
  activo: boolean;
  estado: string;
  datoExtra: number;
};

export type Calefaccion = {
  id: number;
  tipo: string;
  marca: string;
  modelo: string;
  potencia: number;
  activa: boolean;
};

export type Registro = {
  id: number;
  fecha: string;
  dispositivo: string;
  accion: string;
  descripcion: string;
  nombreTecnico: string;
};

export type entradaAgua = 'Fondo' | 'Barrefondo' | 'Skimmer' | 'Tanque';

export type funcionFiltro =
  | 'FILTRAR'
  | 'RETROLAVAR'
  | 'DESAGOTAR'
  | 'RECIRCULAR'
  | 'ENJUAGAR'
  | 'REPOSO';

export type ligthsType = 'manual' | 'programmed';

export type sistemaGermicida = 'UV' | 'Ionizador' | 'Trasductor';

type EquipoDashboard = {
  tipo: string; // Tipo de equipo (por ejemplo, "Uv", "Ionizador")
  estado: string; // Estado del equipo (por ejemplo, "Operativo", "Inactivo")
};


//INTERFACES PARA NUEVA PISCINA

export interface PiscinaNueva {
  id: null;
  administradorId: number | null;
  direccion: string;
  ciudad: string;
  codigoPlaca: string;
  notas: string | null;
  esDesbordante: boolean;
  largo: number;
  ancho: number;
  profundidad: number;
  volumen: number;
  volumenTC: number | null;
  bomba: BombaNuevo[];
  filtro: FiltroNuevo;
  sistemaGermicida: GermicidaNuevo[];
  cloroSalino: boolean;
  controlAutomaticoPH: boolean;
  orp: boolean;
  calefaccion: CalefaccionNueva | null;
}

export type BombaNuevo = {
  id: null;
  marca: string;
  modelo: string;
  potencia: number;
  activa: boolean;
  tipo: string;
};

export type FiltroNuevo = {
  id: null;
  tipo: string;
  marca: string;
  modelo: string;
  diametro: number;
  datoExtra: number;
  tiempoDeVidaUtil: number;
};

export type GermicidaNuevo = {
  id: null;
  tipo: string;
  marca: string;
  activa: boolean;
  tiempoVidaUtil: number;
  datoExtra: number;
};

export type CalefaccionNueva = {
  id: null;
  tipo: string;
  marca: string;
  modelo: string;
  potencia: number;
  activa: boolean;
};

export interface GenerarPatenteDTO {
  firmware: string;
  tipo: string;
}

