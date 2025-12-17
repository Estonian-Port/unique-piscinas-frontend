import {
  entradaAgua,
  funcionFiltro,
  PiscinaResume,
} from '@/data/domain/piscina';
import api from '../helper/auth.interceptor';

const ESTADO_PISCINA = '/estado-piscina';

class EstadoPiscinaService {

  actualizarEntradaDeAgua = async (
    piscinaId: number,
    entradaAgua: entradaAgua[]
  ): Promise<{ data: PiscinaResume; message: string }> => {
    const response = await api.put(
      `${ESTADO_PISCINA}/update-entrada-agua/${piscinaId}`,
      entradaAgua
    );
    return { data: response.data.data, message: response.data.message };
  };

  actualizarFuncionFiltro = async (
    piscinaId: number,
    funcionFiltro: funcionFiltro
  ): Promise<{ data: PiscinaResume; message: string }> => {
    const response = await api.put(
      `${ESTADO_PISCINA}/update-funcion-filtro/${piscinaId}`,
      { funcion: funcionFiltro },
      { headers: { 'Content-Type': 'application/json' } }
    );
    return { data: response.data.data, message: response.data.message };
  };

  encenderLucesManual = async (piscinaId: number): Promise<void> => {
    await api.post(`${ESTADO_PISCINA}/encender-luces-manuales/${piscinaId}`);
  };

  apagarLucesManual = async (piscinaId: number): Promise<void> => {
    await api.post(`${ESTADO_PISCINA}/apagar-luces-manuales/${piscinaId}`);
  };

  actualizarEstadoBombaExtra = async (
    piscinaId: number,
    bombaId: number,
    estado: boolean
  ): Promise<PiscinaResume> => {
    const response = await api.post(
      `${ESTADO_PISCINA}/actualizar-estado-bomba-extra/${piscinaId}/${bombaId}`,
      { activa: estado }
    );
    return response.data.data;
  };
}

export const estadoPiscinaService = new EstadoPiscinaService();
