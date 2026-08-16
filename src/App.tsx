import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import RootNavigator from './navigation';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getAuthToken } from './api/client';
import { AuthProvider } from './auth/AuthContext';

const theme = {
  colors: {
    primary: '#0f172a',
    background: '#ffffff',
    accent: '#2563eb'
  }
};

export default function App() {
  useEffect(() => {
    // load saved auth token into axios defaults
    (async () => {
      try {
        await getAuthToken();
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <SafeAreaProvider>
        <AuthProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </AuthProvider>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
