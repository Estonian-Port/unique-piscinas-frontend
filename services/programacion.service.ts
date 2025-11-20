import api from '../helper/auth.interceptor';
import { dayMap, Programacion } from '@/data/domain/cicloFiltrado';

const PROGRAMACIONES_PISCINA = '/programaciones-piscina';

class ProgramacionesPiscinaService {
  addProgramacion = async (
    piscinaId: number,
    programacion: Programacion
  ): Promise<{ data: Programacion; message: string }> => {
    const programacionToSend = {
      ...programacion,
      id: null,
      dias: programacion.dias.map((d: string) => dayMap[d]),
      tipo: programacion.tipo.toUpperCase(),
    };
    const response = await api.post(
      `${PROGRAMACIONES_PISCINA}/add-programacion/${piscinaId}`,
      programacionToSend
    );
    return { data: response.data.data, message: response.data.message };
  };

  deleteProgramacion = async (
    piscinaId: number,
    programacionId: number
  ): Promise<{ data: Programacion; message: string }> => {
    const response = await api.delete(
      `${PROGRAMACIONES_PISCINA}/delete-programacion/${piscinaId}/${programacionId}`
    );
    return { data: response.data.data, message: response.data.message };
  };

  desactivarProgramacion = async (
    piscinaId: number,
    programacionId: number
  ): Promise<{ data: Programacion; message: string }> => {
    const response = await api.put(
      `${PROGRAMACIONES_PISCINA}/desactivar-programacion/${piscinaId}/${programacionId}`
    );
    return { data: response.data.data, message: response.data.message };
  };

  activarProgramacion = async (
    piscinaId: number,
    programacionId: number
  ): Promise<{ data: Programacion; message: string }> => {
    const response = await api.put(
      `${PROGRAMACIONES_PISCINA}/activar-programacion/${piscinaId}/${programacionId}`
    );
    return { data: response.data.data, message: response.data.message };
  };

  updateProgramacion = async (
    piscinaId: number,
    programacion: Programacion
  ): Promise<{ data: Programacion; message: string }> => {
    const programacionToSend = {
      ...programacion,
      dias: programacion.dias.map((d: string) => dayMap[d]),
      tipo: programacion.tipo.toUpperCase(),
    };
    const response = await api.put(
      `${PROGRAMACIONES_PISCINA}/update-programacion/${piscinaId}`,
      programacionToSend
    );
    return { data: response.data.data, message: response.data.message };
  };
}

export const programacionService = new ProgramacionesPiscinaService();
