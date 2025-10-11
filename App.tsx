import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import Root from "./app/root";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { AuthProvider } from "./shared/context/AuthContext";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar, StyleSheet } from "react-native";


SplashScreen.preventAutoHideAsync().catch(() => { });

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      <SafeAreaView style={styles.container} edges={["right", "left", "bottom"]}>
        <NavigationContainer
          onReady={async () => {
            try {
              await SplashScreen.hideAsync();
            } catch {}
          }}
        >
          <AuthProvider>
            <Root />
          </AuthProvider>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
