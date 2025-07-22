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
import { Platform, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { getSelectedVehicle } from '@/store/selectionSlice';
import { ConnectionIcon } from '@/components/platforms/connection';
import { hasStandardMetricsSelector, metricsSlice } from '@/store/metricsSlice';
import { useDispatch } from 'react-redux';
import * as Sentry from '@sentry/react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

Sentry.init({
  dsn: 'https://42f9d70e8f2c9079587606dd89d4b41d@o4509709354205184.ingest.de.sentry.io/4509709355909200',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "web") {
    console.log('[registerForPushNotificationsAsync] Web platform, no push notifications');
    return;
  }
  
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      handleRegistrationError('[registerForPushNotificationsAsync] Permission not granted to get push token for push notification!');
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError('[registerForPushNotificationsAsync] Project ID not found');
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('[registerForPushNotificationsAsync] pushTokenString', pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    console.log('[registerForPushNotificationsAsync] Must use physical device for push notifications');
  }
}

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
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(
    undefined
  );

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then(token => setExpoPushToken(token ?? ''))
      .catch((error: any) => setExpoPushToken(`${error}`));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      console.log('[notificationListener] notification', notification);
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      notificationListener.remove();
      responseListener.remove();
    };
  }, []);

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