import {
  Pressable,
  type PressableProps,
  Animated,
  Platform,
} from 'react-native';
import type { ReactNode } from 'react';
import { useRef } from 'react';

interface CustomPressableProps extends Omit<PressableProps, 'children'> {
  children: ReactNode;
  onPress?: () => void;
  className?: string;
  containerClassName?: string;
  activeOpacity?: number;
  disabled?: boolean;
}

const CustomPressable = ({
  children,
  onPress,
  className = '',
  containerClassName = '',
  activeOpacity = 0.7,
  disabled = false,
  ...props
}: CustomPressableProps) => {
  const animatedOpacity = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (!disabled && Platform.OS !== 'web') {
      Animated.timing(animatedOpacity, {
        toValue: activeOpacity,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (!disabled && Platform.OS !== 'web') {
      Animated.timing(animatedOpacity, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }).start();
    }
  };

  // Para web, usar Pressable nativo con su propio estilo de opacidad
  if (Platform.OS === 'web') {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        className={`${containerClassName} ${className}`}
        style={({ pressed }) => ({
          opacity: disabled ? 0.5 : pressed ? activeOpacity : 1,
          transition: 'opacity 0.1s',
        })}
        {...props}
      >
        {children}
      </Pressable>
    );
  }

  // Para celus si se usa la animación con Animated.View
  return (
    <Animated.View
      className={containerClassName}
      style={{
        opacity: disabled ? 0.5 : animatedOpacity,
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        className={className}
        {...props}
      >
        {children}
      </Pressable>
    </Animated.View>
  );
};

export default CustomPressable;
