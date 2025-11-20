import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import ModalError from '@/components/utiles/modalError';
import { router } from 'expo-router';
import LogoUnique from '../assets/images/01_LOGO_UNIQUE.svg';
import { useAuth } from '@/context/authContext';
import { Eye, EyeOff, LogIn } from 'react-native-feather';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RolType } from '@/data/domain/rol';
import CustomPressable from '@/components/utiles/customPressable';

const Login = () => {
  const [email, setEmail] = useState('leo@unique.com');
  const [password, setPassword] = useState('asd');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login, usuario } = useAuth();

  useEffect(() => {
    if (usuario) {
      const { rol, primerLogin } = usuario;

      if (rol === RolType.ADMIN) {
        router.replace('/dashboard');
      } else if (rol === RolType.PAT_GEN) {
        router.replace('/generarPatente');
      } else if (rol === RolType.USER) {
        if (primerLogin) {
          router.replace('/registro');
        } else {
          router.replace('/pools');
        }
      }
    }
  }, [usuario]);

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error: any) {
      let errorMessage = 'Error desconocido';

      // Error de red (sin respuesta del servidor)
      if (error.code === 'ERR_NETWORK') {
        errorMessage =
          'Error de conexión. Verifica tu conexión a internet o que el servidor esté disponible.';
      }
      // Error con respuesta del servidor
      else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      // Otros errores de Axios
      else if (error.message) {
        errorMessage = error.message;
      }

      setModalMessage(errorMessage);
      setModalVisible(true);
    }
  };

  return (
    <>
      <StatusBar style="light" backgroundColor="#1e1b4b" />
      <View
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 100 }}
        className="bg-navy-unique"
      />
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <StatusBar style="light" backgroundColor="#1e1b4b" />
        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 100,
          }}
          className="bg-navy-unique"
        />
        <SafeAreaView
          style={{ flex: 1 }}
          className="bg-navy-unique"
          edges={['top']}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
          >
            <Pressable
              style={{ flex: 1 }}
              className="items-center justify-center px-4"
              onPress={(e) => e.stopPropagation()}
            >
              <View className="mb-8 items-center">
                <LogoUnique width={250} height={220} />
              </View>

              <View style={{ width: 250 }}>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#9CA3AF"
                  className="border-2 bg-white border-gray-300 rounded-md py-4 px-3 mb-5 w-full"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  returnKeyType="next"
                />

                <View className="relative w-full mb-5">
                  <TextInput
                    className="border-2 bg-white border-gray-300 rounded-md py-4 px-3 w-full pr-12"
                    value={password}
                    placeholder="Ingrese su contraseña"
                    placeholderTextColor="#9ca3af"
                    secureTextEntry={!showPassword}
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    returnKeyType="done"
                    onSubmitEditing={() => handleLogin(email, password)}
                  />
                  <Pressable
                    className="absolute right-4 top-4"
                    onPress={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeOff width={20} height={20} stroke="#666" />
                    ) : (
                      <Eye width={20} height={20} stroke="#666" />
                    )}
                  </Pressable>
                </View>

                <CustomPressable
                  onPress={() => handleLogin(email, password)}
                  className="bg-gold-unique rounded-full px-4 py-2 flex-row items-center justify-center h-14 w-full"
                  activeOpacity={0.8}
                >
                  <LogIn color={'white'} />
                  <Text className="font-geist-semi-bold text-white ml-2">
                    Iniciar Sesión
                  </Text>
                </CustomPressable>
              </View>
            </Pressable>
          </KeyboardAvoidingView>

          <ModalError
            visible={modalVisible}
            message={modalMessage}
            onClose={() => setModalVisible(false)}
          />
        </SafeAreaView>
      </Pressable>
    </>
  );
};

export default Login;
