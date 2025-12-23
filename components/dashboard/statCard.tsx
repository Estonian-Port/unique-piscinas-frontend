import { View, Text } from 'react-native';
import { ScreenCard } from '../utiles/ScreenCard';

type StatCardProps = {
  title: string;
  value: number;
  unity?: string;
  label: string;
  icon: any;
};

const StatCard = ({
  title,
  value,
  unity = '',
  label,
  icon,
}: StatCardProps) => {
  return (
    <ScreenCard>
      <View className="flex-row justify-between mb-2">
        <Text className="font-geist-semi-bold text-xl text-text">{title}</Text>
        {icon}
      </View>
      <Text className="font-geist-semi-bold text-3xl text-text mb-1">{`${value} ${unity}`}</Text>
      <Text className="font-geist-light text-base text-gray-500">{label}</Text>
    </ScreenCard>
  );
};

export default StatCard;