import { View, Text, Switch, Modal } from 'react-native';
import React, { useState } from 'react';
import CustomPressable from '../utiles/customPressable';

type Props = {
  orp: boolean;
  controlPH: boolean;
  cloroSalino: boolean;
  onChange?: (values: {
    orp: boolean;
    controlPH: boolean;
    cloroSalino: boolean;
  }) => void;
};

export default function CompuestosCard({
  orp,
  controlPH,
  cloroSalino,
  onChange,
}: Props) {
  const [values, setValues] = useState({ orp, controlPH, cloroSalino });
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingKey, setPendingKey] = useState<keyof typeof values | null>(
    null
  );
  const [pendingValue, setPendingValue] = useState<boolean>(false);

  const handleSwitchRequest = (key: keyof typeof values, value: boolean) => {
    setPendingKey(key);
    setPendingValue(value);
    setModalVisible(true);
  };

  const handleConfirm = () => {
    if (pendingKey !== null) {
      const newValues = { ...values, [pendingKey]: pendingValue };
      setValues(newValues);
      onChange?.(newValues);
    }
    setModalVisible(false);
    setPendingKey(null);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setPendingKey(null);
  };

  const cardStyle = (active: boolean) =>
    `rounded-lg py-2 px-4 my-2 w-full justify-between flex-row items-center ${
      active ? 'bg-gray-100' : 'bg-gray-100 opacity-50'
    }`;

  return (
    <View>
      <View className="justify-around items-center">
        <View className={cardStyle(values.orp)}>
          <Text className="font-geist-semi-bold text-text mr-2">ORP</Text>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#000000' }}
            thumbColor={values.orp ? '#fcdb99' : '#ffffff'}
            ios_backgroundColor="#d3d3d3"
            value={values.orp}
            onValueChange={(v) => handleSwitchRequest('orp', v)}
          />
        </View>
        <View className={cardStyle(values.controlPH)}>
          <Text className="font-geist-semi-bold text-text mr-2">
            Control pH
          </Text>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#000000' }}
            thumbColor={values.controlPH ? '#fcdb99' : '#ffffff'}
            ios_backgroundColor="#d3d3d3"
            value={values.controlPH}
            onValueChange={(v) => handleSwitchRequest('controlPH', v)}
          />
        </View>
        <View className={cardStyle(values.cloroSalino)}>
          <Text className="font-geist-semi-bold text-text mr-2">
            Cloro Salino
          </Text>
          <Switch
            trackColor={{ false: '#d3d3d3', true: '#000000' }}
            thumbColor={values.cloroSalino ? '#fcdb99' : '#ffffff'}
            ios_backgroundColor="#d3d3d3"
            value={values.cloroSalino}
            onValueChange={(v) => handleSwitchRequest('cloroSalino', v)}
          />
        </View>
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white p-6 rounded-lg w-4/5 max-w-md">
            <Text className="text-lg font-geist-semi-bold mb-4 text-center">
              ¿Desea {pendingValue ? 'agregar' : 'quitar'} este compuesto a la
              piscina?
            </Text>
            <View className="flex-row justify-between mt-4">
              <CustomPressable
                className="bg-gray-400 rounded-lg mr-1 items-center justify-center h-12"
                onPress={handleCancel}
                containerClassName="w-1/2"
              >
                <Text className="text-white font-geist-semi-bold">
                  Cancelar
                </Text>
              </CustomPressable>
              <CustomPressable
                className="bg-purple-unique rounded-lg ml-1 items-center justify-center h-12"
                containerClassName="w-1/2"
                onPress={handleConfirm}
              >
                <Text className="text-white font-geist-semi-bold">
                  Confirmar
                </Text>
              </CustomPressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
