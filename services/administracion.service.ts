import { PiscinaRegistrada, PiscinaFichaTecnica, PiscinaEquipos, PiscinaListItem, GenerarPatenteDTO } from '@/data/domain/piscina';
import api from '../helper/auth.interceptor';
import { StatDashboard } from '@/data/domain/stat';
import { UsuarioList, UsuarioPendiente, UsuarioRegistrado } from '@/data/domain/user';

const ADMINISTRACION = '/administracion'

class AdministracionService {

  getEstadisticas = async (userId: number): Promise<StatDashboard> => {
    const response = await api.get(`${ADMINISTRACION}/estadisticas/${userId}`);
    return response.data.data;
  };

  getPiscinasRegistradas = async (userId: number): Promise<PiscinaRegistrada[]> => {
    const response = await api.get(`${ADMINISTRACION}/piscinas-registradas/${userId}`);
    return response.data.data;
  };

  getPiscinaFichaTecnicaById = async (userId:number, piscinaId: number): Promise<PiscinaFichaTecnica | null> => {
    const response = await api.get(`${ADMINISTRACION}/piscina-ficha-tecnica/${userId}/${piscinaId}`);
    return response.data.data;
  };

  getPiscinaEquiposById = async (userId:number, piscinaId: number): Promise<PiscinaEquipos> => {
    const response = await api.get(`${ADMINISTRACION}/piscina-equipos/${userId}/${piscinaId}`);
    return response.data.data;
  };

  getUsuariosRegistrados = async (userId: number): Promise<UsuarioRegistrado[]> => {
    const response = await api.get(`${ADMINISTRACION}/usuarios-registrados/${userId}`);
    return response.data.data;
  };

  getUsuariosPendientes = async (userId: number): Promise<UsuarioPendiente[]> => {
    const response = await api.get(`${ADMINISTRACION}/usuarios-pendientes/${userId}`);
    return response.data.data;
  }

  getUsuarios = async (userId: number): Promise<UsuarioList[]> => {
    const response = await api.get(`${ADMINISTRACION}/usuarios-nueva-piscina/${userId}`);
    return response.data.data;
  }

  getPiscinasDisponibles = async () : Promise<PiscinaListItem[]> => {
    const response = await api.get(`${ADMINISTRACION}/no-asignadas`);
    return response.data.data;
  }

  asignarPiscina = async (userId: number, piscinaId: number): Promise<void> => {
    const response = await api.put(`${ADMINISTRACION}/asignar-piscina/${piscinaId}/${userId}`);
    return response.data;
  }

  desvincularPiscina = async (userId: number, piscinaId: number): Promise<void> => {
    const response = await api.put(`${ADMINISTRACION}/desvincular-piscina/${piscinaId}/${userId}`);
    return response.data;
  }

  getPatentes = async (): Promise<string[]> => {
    const response = await api.get(`${ADMINISTRACION}/patentes-nueva-piscina`);
    return response.data.data;
  }

  generarPatente = async (userId: number, body: GenerarPatenteDTO): Promise<string> => {
    const response = await api.post(`${ADMINISTRACION}/generar-patente/${userId}`, body);
    return response.data.data;
  };
}

export const administracionService = new AdministracionService();