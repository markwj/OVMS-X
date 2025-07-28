import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState, useRef } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme, PaperProvider, Portal, Dialog, Text, Button } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistedStore } from '@/store/root';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { VehicleSelector } from '@/components/ui/VehicleSelector';
import { Drawer } from 'expo-router/drawer';
import { Appearance, Platform, useWindowDimensions } from 'react-native';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { getSelectedVehicle } from '@/store/selectionSlice';
import { ConnectionIcon, HandleNotificationIncoming, HandleNotificationResponse } from '@/components/platforms/connection';
import { selectHasStandardMetrics, metricsSlice } from '@/store/metricsSlice';
import { useDispatch } from 'react-redux';
import * as Sentry from '@sentry/react-native';
import * as Device from 'expo-device';
import { isRunningInExpoGo } from 'expo';
// Conditionally import notifications to avoid warnings in Expo Go
let Notifications: any = null;
if (!isRunningInExpoGo()) {
  Notifications = require('expo-notifications');
}
import * as Updates from 'expo-updates';
import * as Network from 'expo-network';
import { setToken, setUniqueID } from '@/store/notificationSlice';
import * as Application from 'expo-application';
import { getVehicles } from '@/store/vehiclesSlice';
import { getColorScheme } from '@/store/preferencesSlice';

const isProduction = !__DEV__ && !process.env.EXPO_PUBLIC_DEVELOPMENT;
const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
  dsn: 'https://42f9d70e8f2c9079587606dd89d4b41d@o4509709354205184.ingest.de.sentry.io/4509709355909200',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  debug: (isProduction) ? false : true,
  enableAutoSessionTracking: (isProduction) ? false : true,
  sessionTrackingIntervalMillis: 10000,
  // Set tracesSampleRate to 1.0 to capture 100% of transactions for tracing. 
  // Adjusting this value in production.
  tracesSampleRate: (isProduction) ? 0.0 : 1.0,
  integrations: [
    // Pass integration
    navigationIntegration,
  ],
  // Tracks slow and frozen frames in the application
  enableNativeFramesTracking: !isRunningInExpoGo(),
});

if (Notifications) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync(dispatch: any) {
  if (!Notifications) {
    console.log('[registerForPushNotificationsAsync] Notifications not available');
    return;
  }

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
      dispatch(setToken(pushTokenString));
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
  const hasStandardMetrics = useSelector(selectHasStandardMetrics);
  const vehicles = useSelector(getVehicles);
  const dispatch = useDispatch();
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<any | undefined>(
    undefined
  );

  useEffect(() => {
    if (Platform.OS === 'ios') {
      Application.getIosIdForVendorAsync().then((id) =>
        dispatch(setUniqueID(id || 'unknown')));
    } else if (Platform.OS === 'android') {
      dispatch(setUniqueID(Application.getAndroidId() || 'unknown'));
    }
  }, []);

  if (!hasStandardMetrics) {
    dispatch(metricsSlice.actions.resetToStandardMetrics());
  }

  useEffect(() => {
    if (Notifications) {
      registerForPushNotificationsAsync(dispatch)
        .then(token => setExpoPushToken(token ?? ''))
        .catch((error: any) => setExpoPushToken(`${error}`));

      const notificationListener = Notifications.addNotificationReceivedListener((notification: any) => {
        console.log('[notificationListener] notification', JSON.stringify(notification?.request?.content));
        HandleNotificationIncoming(notification?.request?.content, vehicles, dispatch);
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log(JSON.stringify(response?.notification?.request?.content));
        HandleNotificationResponse(response?.notification?.request?.content, vehicles, dispatch);
      });

      return () => {
        notificationListener.remove();
        responseListener.remove();
      };
    }
  }, [dispatch]);

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
          return <VehicleSelector navigation={props.navigation} />
        }}>
      </Drawer>
    </>
  )
}

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();
  const [expoPushToken, setExpoPushToken] = useState('');

  // This code is to check if the device is connected to the internet.
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const checkNetwork = async () => {
      const status = await Network.getNetworkStateAsync();
      setIsConnected(status?.isConnected ?? false);
    };

    // Check initially
    checkNetwork();

    // Add listener for changes
    const unsubscribe = Network.addNetworkStateListener((state) => {
      setIsConnected(state?.isConnected ?? false);
    });

    return () => {
      if (unsubscribe) unsubscribe.remove();
    };
  }, []);

  // This code is to check for updates, and handle automatic reload.
  const [updateDialogSkipped, setUpdateDialogSkipped] = React.useState(false);
  const {
    isUpdateAvailable,
    isChecking,
    isUpdatePending } = Updates.useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded; apply it now
      Updates.reloadAsync();
    }
  }, [isUpdatePending]);

  useEffect(() => {
    const isProduction = !__DEV__ &&
      !(Constants.executionEnvironment == ExecutionEnvironment.StoreClient) &&
      Platform.OS !== 'web';

    if (isConnected && isProduction) {
      Updates.checkForUpdateAsync();
      setUpdateDialogSkipped(false);
    }
  }, [isConnected]);

  const { DarkTheme, LightTheme } = adaptNavigationTheme({
    reactNavigationDark: NavigationDarkTheme,
    reactNavigationLight: NavigationDefaultTheme,
    materialDark: MD3DarkTheme,
    materialLight: MD3LightTheme
  });
  //@ts-ignore
  const theme = (colorScheme == 'dark') ? { ...MD3DarkTheme, colors: MD3DarkTheme.colors } : { ...MD3LightTheme, colors: MD3LightTheme.colors };
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
              <Portal>
                <Dialog visible={!updateDialogSkipped && isUpdateAvailable}>
                  <Dialog.Title>{t('Update Available')}</Dialog.Title>
                  <Dialog.Content>
                    <Text variant="bodyMedium">
                      {t('An update for Box Mail is available. We suggest to install the update now, or you can skip it until later.')}
                    </Text>
                  </Dialog.Content>
                  <Dialog.Actions>
                    <Button onPress={() => { Updates.fetchUpdateAsync() }}>Update now</Button>
                    <Button onPress={() => { setUpdateDialogSkipped(true) }}>Skip until later</Button>
                  </Dialog.Actions>
                </Dialog>
              </Portal>
              <MainLayout />
            </PersistGate>
          </PaperProvider>
        </ThemeProvider>
      </Provider>
    </GestureHandlerRootView>
  );
});