import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated';
import Constants from 'expo-constants';
import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme, PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistedStore } from '@/store/root';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { VehicleSelector } from '@/components/ui/VehicleSelector';
import { Drawer } from 'expo-router/drawer';
import { useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { getSelectedVehicle } from '@/store/selectionSlice';
import { ConnectionIcon } from '@/components/platforms/connection';
import { hasStandardMetricsSelector, metricsSlice } from '@/store/metricsSlice';
import { useDispatch } from 'react-redux';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://42f9d70e8f2c9079587606dd89d4b41d@o4509709354205184.ingest.de.sentry.io/4509709355909200',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

const MainLayout = () => {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const selectedVehicle = useSelector(getSelectedVehicle);
  const hasStandardMetrics = useSelector(hasStandardMetricsSelector);
  const dispatch = useDispatch();

  if (!hasStandardMetrics) {
    dispatch(metricsSlice.actions.resetToStandardMetrics());
  }

  return (
    <>
    <StatusBar style='auto' hidden={false} />
    <Drawer
      defaultStatus="closed"
      screenOptions={{
        title: selectedVehicle?.name ?? '',
        drawerType: isLargeScreen ? 'permanent' : 'slide',
        drawerStyle: isLargeScreen ? null : { width: '50%' },
        drawerStatusBarAnimation: 'slide',
        keyboardDismissMode: 'on-drag',
        headerRight: () => <ConnectionIcon />
      }}
      drawerContent={(props) => {
        return <VehicleSelector />
      }}>
    </Drawer>
    </>
      )
}

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationDark: NavigationDarkTheme,
    reactNavigationLight: NavigationDefaultTheme,
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme
  });
  //@ts-ignore
  const { theme } = (colorScheme === 'dark')
  //@ts-ignore
    ? { ...MD3DarkTheme, colors: MD3DarkTheme.dark }
  //@ts-ignore
    : { ...MD3LightTheme, colors: MD3LightTheme.light };
  (colorScheme === 'dark') ? DarkTheme : NavigationDefaultTheme;
  console.log('[layout] colour scheme', colorScheme, 'theme', theme);

  return (
    <GestureHandlerRootView>
      <Provider store={store}>
        <ThemeProvider value={
          colorScheme === 'light'
            ? { ...LightTheme, fonts: NavigationDefaultTheme.fonts }
            : { ...DarkTheme, fonts: NavigationDarkTheme.fonts }
        }>
          <PaperProvider theme={theme}>
            <PersistGate loading={null} persistor={persistedStore}>
              <MainLayout />
            </PersistGate>
          </PaperProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
});