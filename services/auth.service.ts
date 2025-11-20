import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../helper/auth.interceptor';
import { UsuarioLogin } from '@/data/domain/user';
import { STORAGE_KEY_TOKEN } from '@/context/authContext';

class AuthService {

  login = async (username: string, password: string): Promise<string> => {
    const response = await api.post('/login', { username, password });
    return response.headers['authorization'];
  };

  getCurrentUser = async (): Promise<UsuarioLogin> => {
    const response = await api.get('/usuario/me');
    return response.data.data;
  };

  setAuthToken = async () => {
    const token = await AsyncStorage.getItem(STORAGE_KEY_TOKEN)
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  };
}

export const authService = new AuthService();
