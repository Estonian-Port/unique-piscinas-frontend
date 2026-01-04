import { View, Text, Pressable } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/context/authContext';
import { UsuarioPendiente } from '@/data/domain/user';
import { administracionService } from '@/services/administracion.service';
import { ScreenCard } from '../utiles/ScreenCard';
import { RefreshCcw, Trash2 } from 'lucide-react-native';
import ModalEliminarInvitacion from './modalEliminarInvitacion';
import { usuarioService } from '@/services/usuario.service';
import Toast from 'react-native-toast-message';
import ModalReenviarInvitacion from './modalReenviarInvitacion';

const UsuariosPendientes = ({ refreshKey }: { refreshKey: number }) => {
  const { usuario } = useAuth();
  const [users, setUsers] = useState<UsuarioPendiente[]>([]);
  const [modalEliminarInvitacionVisible, setModalEliminarInvitacionVisible] =
    useState(false);
  const [modalReenviarInvitacionVisible, setModalReenviarInvitacionVisible] =
    useState(false);

  const [selectedEmail, setSelectedEmail] = useState<string>('');

  const fetchData = useCallback(async () => {
    if (!usuario) return;
    try {
      const response = await administracionService.getUsuariosPendientes(
        usuario.id
      );
      setUsers(response);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [usuario]);

  useEffect(() => {
    fetchData();
  }, [fetchData, refreshKey]);

  const handleReenviar = async (email: string) => {
    try {
      await usuarioService.reenviarInvitacion(email);
      Toast.show({
        type: 'success',
        text1: 'Invitación reenviada',
        text2: `La invitación para ${email} ha sido reenviada exitosamente.`,
        position: 'bottom',
      });
      await fetchData();
    } catch (error) {
      console.error('Error reenviando invitación:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `No se pudo reenviar la invitación para ${email}.`,
        position: 'bottom',
      });
    }
  };

  const handleEliminar = async (email: string) => {
    try {
      await administracionService.eliminarInvitacion(email);
      Toast.show({
        type: 'success',
        text1: 'Invitación eliminada',
        text2: `La invitación para ${email} ha sido eliminada exitosamente.`,
        position: 'bottom',
      });
      await fetchData();
    } catch (error) {
      console.error('Error eliminando invitación:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: `No se pudo eliminar la invitación para ${email}.`,
        position: 'bottom',
      });
    }
  };

  return (
    <ScreenCard>
      <View className="mb-3">
        <Text className="font-geist-semi-bold text-text text-3xl">
          Usuarios Pendientes
        </Text>
        <Text className="font-geist-light text-text text-base">
          Invitaciones enviadas por email
        </Text>
      </View>
      {users.length === 0 ? (
        <View className="items-center justify-center py-8">
          <Text className="font-geist-semi-bold text-text text-lg text-center">
            No invitaciones pendientes
          </Text>
        </View>
      ) : (
        users.map((user) => (
          <View
            className="flex-row justify-between items-center py-4 border-b border-gray-200"
            key={user.id}
          >
            <View className="flex-1 mr-4">
              <Text
                className="font-geist-semi-bold text-text text-base"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flexShrink: 1 }}
              >
                {user.email}
              </Text>
              <Text
                className="font-geist text-gray-500 text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={{ flexShrink: 1 }}
              >
                Invitación enviada el {user.fechaAlta}
              </Text>
            </View>

            <Pressable
              className="mr-2"
              onPress={() => {
                setSelectedEmail(user.email);
                setModalEliminarInvitacionVisible(true);
              }}
            >
              <Trash2 height={26} width={26} color={'red'} />
            </Pressable>

            <Pressable
              className="ml-2"
              onPress={() => {
                setSelectedEmail(user.email);
                setModalReenviarInvitacionVisible(true);
              }}
            >
              <RefreshCcw height={26} width={26} color={'green'} />
            </Pressable>
          </View>
        ))
      )}

      {/* Una sola instancia de cada modal, con el email seleccionado */}
      <ModalEliminarInvitacion
        visible={modalEliminarInvitacionVisible}
        onSave={(email) => {
          // si modal pasa email, úsalo; sino usa selectedEmail
          const mailToDelete = selectedEmail;
          if (mailToDelete) handleEliminar(mailToDelete);
        }}
        onClose={() => {
          setModalEliminarInvitacionVisible(false);
        }}
        mail={selectedEmail}
      />

      <ModalReenviarInvitacion
        visible={modalReenviarInvitacionVisible}
        onSave={(email) => {
          const mailToSend = selectedEmail;
          if (mailToSend) handleReenviar(mailToSend);
        }}
        onClose={() => {
          setModalReenviarInvitacionVisible(false);
        }}
        mail={selectedEmail}
      />
    </ScreenCard>
  );
};

export default UsuariosPendientes;
