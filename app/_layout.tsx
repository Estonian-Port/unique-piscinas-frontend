import { Slot, SplashScreen, usePathname } from 'expo-router';
import './globals.css';
import { useFonts } from 'expo-font';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import NavBar from '@/components/utiles/navBar';
import { AuthProvider } from '@/context/authContext';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const pathname = usePathname();
  const isLoginScreen = pathname === "/login";
  
  const [fontsLoaded] = useFonts({
    "Geist-ExtraLight": require("../assets/fonts/Geist-ExtraLight.ttf"),
    "Geist-Light": require("../assets/fonts/Geist-Light.ttf"),
    "Geist-Regular": require("../assets/fonts/Geist-Regular.ttf"),
    "Geist-Bold": require("../assets/fonts/Geist-Bold.ttf"),
    "Geist-semiBold": require("../assets/fonts/Geist-SemiBold.ttf"),
    ...MaterialIcons.font,
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <AuthProvider>
      <SafeAreaView 
        style={{ 
          flex: 1, 
          backgroundColor: isLoginScreen ? '#222247' : '#FFFFFF' 
        }}
      >
        <StatusBar style="dark" />
        <NavBar />
        <Slot />
        <Toast />
      </SafeAreaView>
    </AuthProvider>
  )
}