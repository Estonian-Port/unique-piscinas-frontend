// Función para normalizar entrada numérica (convierte coma a punto)
export const normalizeNumericInput = (value: string): string => {
  return value.replace(',', '.');
};

// Función para validar si es un número válido
export const isValidNumber = (value: string): boolean => {
  const normalized = normalizeNumericInput(value);
  return !isNaN(parseFloat(normalized)) && isFinite(parseFloat(normalized));
};