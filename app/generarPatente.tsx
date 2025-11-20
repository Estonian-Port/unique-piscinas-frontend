import { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import { Screen } from '@/components/utiles/Screen';
import { administracionService } from '@/services/administracion.service';
import { useAuth } from '@/context/authContext';
import { GenerarPatenteDTO } from '@/data/domain/piscina';
import CustomPressable from '@/components/utiles/customPressable';

const GenerarPatente = () => {
  const { usuario } = useAuth();
  const [patente, setPatente] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [firmware, setFirmware] = useState('');
  const [tipo, setTipo] = useState('');

  const handleGenerarPatente = async () => {
    if (!usuario) return;

    try {
      setLoading(true);

      const dto: GenerarPatenteDTO = {
        firmware,
        tipo
      };

      const nuevaPatente = await administracionService.generarPatente(usuario.id, dto);
      setPatente(nuevaPatente);
    } catch (error) {
      console.error('Error generando patente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <View className="flex-1 justify-center items-center bg-white px-6">
        {/* Patente generada */}
        <Text className="font-geist-semi-bold text-6xl text-text mb-2 tracking-widest">
          {patente ? patente : '- - - -'}
        </Text>

        {/* Mensaje secundario */}
        <Text className="text-gray-400 text-sm mb-4 text-center">
          Genere una nueva patente presionando el botón
        </Text>

        {/* Inputs */}
        <TextInput
          value={firmware}
          onChangeText={setFirmware}
          placeholder="Firmware"
          placeholderTextColor="#9CA3AF"
          className="border border-gray-300 rounded-lg p-3 w-full mb-2"
        />
        <TextInput
          value={tipo}
          onChangeText={setTipo}
          placeholder="Tipo"
          placeholderTextColor="#9CA3AF"
          className="border border-gray-300 rounded-lg p-3 w-full mb-4"
        />

        {/* Botón */}
        <CustomPressable
          disabled={loading || !firmware || !tipo}
          onPress={handleGenerarPatente}  // <= esto faltaba
          className={`rounded-lg p-4 w-full items-center ${
            loading
              ? 'bg-purple-300'
              : !firmware || !tipo
              ? 'bg-gray-300'
              : 'bg-purple-unique'
            }`}
          >
          <Text className="text-white text-lg font-geist-semi-bold">
            {loading ? 'Generando...' : 'Generar'}
          </Text>
        </CustomPressable>
      </View>
    </Screen>
  );
};

export default GenerarPatente;
