import { Gauge } from "lucide-react-native"
import { View, Text } from "react-native"

type PressureGaugeProps = {
  title?: string
  currentValue: number
  minValue: number
  maxValue: number
  optimalMin?: number
  optimalMax?: number
  unit?: string
}

export default function PressureGauge({
  title = "Presión de trabajo:",
  currentValue = 1.2,
  minValue = 0,
  maxValue = 3,
  optimalMin = 0.8,
  optimalMax = 1.5,
  unit = "bar",
}: PressureGaugeProps) {
  // Calculate the percentage of the current value within the range
  const percentage = Math.min(Math.max(((currentValue - minValue) / (maxValue - minValue)) * 100, 0), 100)

  // Determine if the current value is within the optimal range
  const isOptimal = currentValue >= optimalMin && currentValue <= optimalMax

  return (
    <View className="w-full my-3">
      <View className="flex-row justify-between items-center mb-1 w-full">
        <View className="flex-row items-center mb-1">
        <Gauge width={18} height={18} color="#000" />
        <Text className='font-geist-semi-bold text-text text-base ml-1'>{title}</Text>
        </View>
        <Text className={`text-base font-bold ${isOptimal ? "text-green-500" : "text-red-500"}`}>
          {currentValue.toFixed(1)} {unit} {isOptimal ? "(Óptima)" : ""}
        </Text>
      </View>

      {/* Progress bar container */}
      <View className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        {/* Progress bar fill */}
        <View className="h-full bg-black" style={{ width: `${percentage}%` }} />
      </View>

      {/* Scale markers */}
      <View className="flex-row justify-between mt-1">
        <Text className="text-xs text-gray-600">
          {minValue} {unit}
        </Text>
        <Text className="text-xs text-green-500">
          {optimalMin}-{optimalMax} {unit}
        </Text>
        <Text className="text-xs text-gray-600">
          {maxValue} {unit}
        </Text>
      </View>
    </View>
  )
}
