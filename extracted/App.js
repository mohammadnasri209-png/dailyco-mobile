import React from 'react';
import { I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { ContentProvider } from './src/context/ContentContext';
import RootNavigator from './src/navigation/RootNavigator';

// Dailyco is a Persian-first app — force right-to-left layout.
// (On a bare/EAS build this needs one restart to fully take effect;
// Expo Go picks it up on reload.)
try {
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  }
} catch (e) {}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ContentProvider>
          <StatusBar style="dark" />
          <RootNavigator />
        </ContentProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
