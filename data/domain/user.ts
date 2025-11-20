import { Piscina, PiscinaListItem } from "./piscina";
import { RolType } from "./rol";

export interface NuevoUsuario {
  email: string;
}

export interface UsuarioLogin {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular: number;
  rol: RolType;
  piscinasId: number[];
  primerLogin: boolean;
}

export interface UsuarioCambioPassword {
  email: string;
  passwordActual: string;
  nuevoPassword: string;
  confirmacionPassword: string;
}

export interface UsuarioRegistrado {
  id: number;
  nombre: string;
  apellido: string;
  celular: number;
  email: string;
  estado: string;
  piscinasAsignadas: PiscinaListItem[];
}

export interface UsuarioPendiente {
  id: number;
  email: string;
  fechaAlta: string;
}

export interface UsuarioList {
  id: number;
  nombre: string;
  apellido: string;
}

export class Usuario {
  id: number;
  name: string;
  lastname: string;
  email: string;
  piscinas: Piscina[];
  isAdmin: boolean;

  constructor(
    id: number,
    name: string,
    lastname: string,
    email: string,
    piscinas: Piscina[],
    isAdmin: boolean
  ) {
    this.id = id;
    this.name = name;
    this.lastname = lastname;
    this.email = email;
    this.piscinas = piscinas;
    this.isAdmin = isAdmin;
  }
}