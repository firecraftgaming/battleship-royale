import React from "react";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WebSocketProvider } from "./src/modules/ws/WebSocketProvider";
import { useFonts } from 'expo-font';
import { Main } from "./src/ui/Main";
import { StatusBar } from "expo-status-bar";

export default function App() {
  const [loaded] = useFonts({
    Inter: require('./assets/fonts/Inter-Light.ttf'),
  });

  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <WebSocketProvider shouldConnect={true}>
        <Main />
      </WebSocketProvider>
      <StatusBar hidden />
    </SafeAreaProvider>
  );
}