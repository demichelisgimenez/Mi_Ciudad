import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';

import Root from './app/root';
import { AuthProvider } from './shared/context/AuthContext';
import { RadioProvider } from '@shared/context/RadioContext';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RadioProvider>
          <NavigationContainer
            onReady={async () => {
              try {
                await SplashScreen.hideAsync();
              } catch {}
            }}
          >
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
            {/* Protegemos laterales y bottom para que el header pueda usar el área superior */}
            <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
              <Root />
            </SafeAreaView>
          </NavigationContainer>
        </RadioProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
