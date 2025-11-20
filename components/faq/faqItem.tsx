import type { FAQ } from '@/data/domain/faq';
import { useState } from 'react';
import { Pressable, View, Text } from 'react-native';
import { ChevronDown, ChevronUp } from 'react-native-feather';

const FAQItem = ({ faq }: { faq: FAQ }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="bg-white rounded-xl mb-3 shadow-sm border border-gray-100">
      <Pressable
        className="flex-row justify-between items-center p-4"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text className="font-geist-semi-bold text-[#0F4C81] text-lg flex-1 pr-3">
          {faq.question}
        </Text>
        {isExpanded ? (
          <ChevronUp height={22} width={22} color="#D4AF37" strokeWidth={2.5} />
        ) : (
          <ChevronDown
            height={22}
            width={22}
            color="#D4AF37"
            strokeWidth={2.5}
          />
        )}
      </Pressable>

      {isExpanded && (
        <View className="bg-[#F0F7FB] mx-3 mb-3 p-4 rounded-lg border-l-4 border-[#D4AF37]">
          <Text className="font-geist text-[#2C3E50] text-base leading-6">
            {faq.answer}
          </Text>
        </View>
      )}
    </View>
  );
};

export default FAQItem;
