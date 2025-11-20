import { View, Text } from 'react-native';
import { ScreenCard } from '../utiles/ScreenCard';
import FAQItem from './faqItem';
import { faqsMock } from '@/data/mock/faqMock';
import { HelpCircle } from 'react-native-feather';
import type { FAQ } from '@/data/domain/faq';

const PreguntasFrecuentes = () => {
  const faqs: FAQ[] = faqsMock;

  return (
    <View className='p-2'>
      <View className='p-2 mb-2'>
        <View className="flex-row items-center justify-start">
          <HelpCircle
            color={'#D4AF37'}
            width={28}
            height={28}
            strokeWidth={2.5}
          />
          <Text className="font-geist-semi-bold text-2xl text-text ml-3">
            Preguntas Frecuentes
          </Text>
        </View>
      </View>

      <View className="py-3">
        {faqs.map((faq, index) => (
          <FAQItem faq={faq} key={index} />
        ))}
      </View>
    </View>
  );
};

export default PreguntasFrecuentes;
