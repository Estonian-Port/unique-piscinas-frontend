// Función para normalizar entrada numérica (convierte coma a punto)
export const normalizeNumericInput = (value: string): string => {
  return value.replace(',', '.');
};

// Función para validar si es un número válido
export const isValidNumber = (value: string): boolean => {
  const normalized = normalizeNumericInput(value);
  return !isNaN(parseFloat(normalized)) && isFinite(parseFloat(normalized));
};

// Función helper para formatear fecha sin problemas de zona horaria
export const formatDateToLocalString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Función para formatear la fecha de yyyy-mm-dd a dd/mm/yyyy
export const formatearFecha = (fecha: string): string => {
    const [year, month, day] = fecha.split('-');
    return `${day}/${month}/${year}`;
  };