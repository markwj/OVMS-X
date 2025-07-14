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
import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme, PaperProvider, IconButton, Text, Icon, View } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistedStore } from '@/store/root';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { VehicleSelector } from '@/components/ui/VehicleSelector';
import { Drawer } from 'expo-router/drawer';
import { useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { getSelectedVehicle } from '@/store/vehiclesSlice';
import { ConnectionIcon } from '@/components/platforms/connection';

const MainLayout = () => {
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 768;
  const selectedVehicle = useSelector(getSelectedVehicle);

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

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationDark: NavigationDarkTheme,
    reactNavigationLight: NavigationDefaultTheme,
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme
  });
  const { theme } = (colorScheme === 'dark')
    ? { ...MD3DarkTheme, colors: MD3DarkTheme.dark }
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
}
