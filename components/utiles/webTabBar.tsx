import React, { useEffect, useState } from "react";
import { View, Pressable, Text, Platform } from "react-native";
import { useRouter, usePathname, Stack } from "expo-router";

const tabsUser = [
  { name: "Resumen", route: "/resume" },
  { name: "Equipamiento", route: "/equipment" },
  { name: "Programación", route: "/programation" },
  { name: "FAQ", route: "/faq" },
];

const tabsAdmin = [
  { name: "Dashboard", route: "/dashboard" },
  { name: "Alta Usuario", route: "/altaUsuario" },
];

interface WebTabBarProps {
  isAdmin?: boolean
}

export default function WebTabBar({ isAdmin = false }: WebTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [tabs, setTabs] = useState(tabsUser)

  useEffect(() => {
    setTabs(isAdmin ? tabsAdmin : tabsUser);
  }, [isAdmin]);

  const handlePress = async (route: string) => {
    if(isAdmin){
      router.replace(`/(tabs-adm)${route}` as any);
    }else{
      router.replace(`/(tabs)${route}`as any);
    }
  }
    
  if (Platform.OS !== "web") return null;

  return (
    <View className="flex-row bg-gray-50 rounded-lg p-1 mb-4 w-full">
      {tabs.map((tab) => {
        const isActive = pathname === tab.route;
        return (
           <Pressable
                key={tab.name}
                onPress={() => handlePress(tab.route)}
                className={`flex-1 py-2 rounded-md items-center justify-center ${
                isActive ? "bg-white shadow" : ""
                }`}
            >
                <Text className={`font-semibold ${isActive ? "text-black" : "text-gray-500"}`}>
                {tab.name}
                </Text>
            </Pressable>
            );
      })}
    </View>
  );
}
