import { UsuarioAlta } from '@/app/registro';
import api from '../helper/auth.interceptor';
import {
  NuevoUsuario,
  UsuarioCambioPassword,
  UsuarioLogin,
} from '@/data/domain/user';

const USUARIO = '/usuario';

class UsuarioService {
  altaUsuario = async (
    nuevoUsuario: NuevoUsuario
  ): Promise<{ data: any; message: string }> => {
    const response = await api.post(`${USUARIO}/altaUsuario`, nuevoUsuario);
    return {
      data: response.data.data,
      message: response.data.message,
    };
  };

  reenviarInvitacion = async (mail: string): Promise<void> => {
    const usuarioNuevo: NuevoUsuario = {
      email: mail,
    };
    const response = await api.post(`${USUARIO}/reenviar-invitacion`, usuarioNuevo);
    return response.data;
  };

  registro = async (
    usuarioActualizado: UsuarioAlta
  ): Promise<{ data: UsuarioLogin; message: string }> => {
    const response = await api.put(`${USUARIO}/registro`, usuarioActualizado);
    return {
      data: response.data.data,
      message: response.data.message,
    };
  };

  eliminar = async (userId: number, administradorId: number): Promise<void> => {
    const response = await api.delete(
      `${USUARIO}/delete/${userId}/${administradorId}`
    );
    return response.data;
  };

  updatePerfil = async (
    usuarioActualizado: UsuarioLogin
  ): Promise<{ data: UsuarioLogin; message: string }> => {
    const usuarioDto = { ...usuarioActualizado, password: '' };

    const response = await api.put(`${USUARIO}/update-perfil`, usuarioDto);
    return {
      data: response.data.data,
      message: response.data.message,
    };
  };

  updatePassword = async (
    usuarioActualizado: UsuarioCambioPassword
  ): Promise<{ data: UsuarioLogin; message: string }> => {
    const response = await api.post(
      `${USUARIO}/update-password`,
      usuarioActualizado
    );
    return {
      data: response.data.data,
      message: response.data.message,
    };
  };
}

export const usuarioService = new UsuarioService();
