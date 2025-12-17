import { ScrollView, View } from 'react-native';
import React from 'react';
import { ScreenTabs } from '@/components/utiles/Screen';
import PreguntasFrecuentes from '@/components/faq/preguntasFrecuentes';
import WebTabBar from '@/components/utiles/webTabBar';
import Header from '@/components/utiles/header';
import { useAuth } from '@/context/authContext';

const FAQ = () => {
  const { usuario, selectedPool } = useAuth();

  return (
    <ScrollView className="flex-1">
      <ScreenTabs>
          <View className='w-11/12'>
            <Header 
              usuario={usuario!} 
              piscina={selectedPool!} 
            />
            <WebTabBar />
          <PreguntasFrecuentes />
        </View>
      </ScreenTabs>
    </ScrollView>
  );
};

export default FAQ;
