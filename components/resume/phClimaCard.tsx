import { View, Text } from 'react-native';
import { ScreenCard } from '../utiles/ScreenCard';
import { Droplet, Droplets } from 'lucide-react-native';
import { climaStatusLabel } from '../utiles/climaIconMapper';

type PhClimaProps = {
  ph: number;
  diferenciaPh: number;
  temperature: number;
  weatherIcon: any;
  colorIcon: string;
  location: string;
  weatherStatus: string;
  humidity: number;
  wind: number;
};

const PhClimaCard = ({
  ph,
  diferenciaPh,
  temperature,
  weatherStatus,
  location,
  humidity,
  wind,
  weatherIcon,
  colorIcon,
}: PhClimaProps) => {
  const min = 0;
  const max = 14;
  const progress = (ph - min) / (max - min);

  return (
    <ScreenCard>
      <View className="flex-row">
        {/* PH */}
        <View className="bg-white p-2 border-r-gray-200 flex-1">
          <View className="flex-row items-center mb-3">
            <Droplets color="#000" width={20}/>
            <Text className="font-geist-semi-bold text-text text-lg">
              pH
            </Text>
          </View>
          <Text className="font-geist-semi-bold text-text text-3xl">{ph}</Text>
          <Text className="font-geist-light text-text text-sm">
            {diferenciaPh.toFixed(2)} desde la última medición
          </Text>
          <View className="w-full bg-gray-200 h-2 rounded-full mt-4">
            <View
              style={{
                width: `${progress * 100}%`,
                backgroundColor: 'black',
                height: '100%',
                borderRadius: 4,
              }}
            />
          </View>
          <View className="flex-row justify-between mt-2">
            <Text className="text-gray-500 text-sm">{min}</Text>
            <Text className="text-gray-500 text-sm">{(min + max) / 2}</Text>
            <Text className="text-gray-500 text-sm">{max}</Text>
          </View>
        </View>

        {/* CLIMA */}
        <View className="bg-white p-2 flex-1">
          <Text className="font-geist-semi-bold text-text text-lg mb-2">
            Clima Local
          </Text>
          <View className="flex-row justify-between items-center mb-3">
            <Text className="font-geist-semi-bold text-text text-3xl">
              {temperature.toFixed(1)} °C
            </Text>
            <View className="w-16 h-16 items-center justify-center">
              {weatherIcon}
            </View>
          </View>
          <Text className="font-geist-light text-text text-sm">{location}</Text>
          <Text className="font-geist-semi-bold text-text text-xl mt-1">
            {climaStatusLabel(weatherStatus)}
          </Text>
          <Text className="text-text text-sm mt-1">Humedad: {humidity}%</Text>
        </View>
      </View>
    </ScreenCard>
  );
};

export default PhClimaCard;
