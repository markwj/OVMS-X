import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { use, useEffect, useRef, useState } from 'react';
import { useColorScheme } from '@/hooks/useColorScheme';
import 'react-native-reanimated';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { MD3LightTheme, MD3DarkTheme, adaptNavigationTheme, PaperProvider, Portal, Dialog, Text, Button, IconButton } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { store, persistedStore } from '@/store/root';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'
import { VehicleSelector } from '@/components/ui/VehicleSelector';
import { Appearance, Platform, useWindowDimensions, AppState } from 'react-native';
import { useTranslation } from 'react-i18next';
import '@/i18n';
import { getSelectedVehicle } from '@/store/selectionSlice';
import { ConnectionDisplay } from '@/components/ui/ConnectionDisplay';
import { selectHasStandardMetrics, metricsSlice } from '@/store/metricsSlice';
import { useDispatch } from 'react-redux';
import * as Sentry from '@sentry/react-native';
import * as Device from 'expo-device';
import { isRunningInExpoGo } from 'expo';
import { Drawer } from 'react-native-drawer-layout';
import { useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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

import MaterialTheme from "@/assets/MaterialTheme.json"
import { getColorScheme, getLanguage } from '@/store/preferencesSlice';
import i18n from '@/i18n';
import { appForeground, appBackground, appInactive,
  connectToVehicle,
  handleNotificationResponse, handleNotificationIncoming, handleNotificationRegistration } from '@/lib/platforms/platform';

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
      handleNotificationRegistration(pushTokenString);
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
  const reduxColorScheme = useSelector(getColorScheme)
  const reduxLanguage = useSelector(getLanguage)
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const appState = useRef(AppState.currentState);

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
        handleNotificationIncoming(notification?.request?.content);
      });

      const responseListener = Notifications.addNotificationResponseReceivedListener((response: any) => {
        console.log(JSON.stringify(response?.notification?.request?.content));
        handleNotificationResponse(response?.notification?.request?.content);
      });

      return () => {
        notificationListener.remove();
        responseListener.remove();
      };
    }
  }, [dispatch]);

  //Sets settings according to stored redux settings
  useEffect(() => {
    if (reduxColorScheme != null && reduxColorScheme !== 'null') {
      Appearance.setColorScheme(reduxColorScheme)
    }
    if (reduxLanguage != null) {
      i18n.changeLanguage(reduxLanguage)
    }
  }, [])

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current != nextAppState) {
        console.log('[MainLayout] app state', appState.current, '=>', nextAppState);
        appState.current = nextAppState;
      switch (appState.current) {
        case 'active':
          appForeground();
          break;
        case 'background':
          appBackground();
          break;
        case 'inactive':
          appInactive();
          break;
        }
      }
    });

    return () => {
      console.log('[MainLayout] cleanup');
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      console.log('[MainLayout] connectToVehicle', selectedVehicle.name);
      connectToVehicle(selectedVehicle);
    }
  }, [selectedVehicle]);

  return (
    <>
      <Drawer
        open={drawerOpen}
        onOpen={() => setDrawerOpen(true)}
        onClose={() => setDrawerOpen(false)}
        drawerType={isLargeScreen ? 'permanent' : 'slide'}
        drawerStyle={isLargeScreen ? null : { width: '50%', backgroundColor: theme.colors.surface }}
        keyboardDismissMode='on-drag'
        renderDrawerContent={() => {
          return <VehicleSelector setDrawerOpen={setDrawerOpen} headerHeight={insets.top} />
        }}>
        <StatusBar style='auto' hidden={false} />
        <Stack
          screenOptions={{
            headerTitleStyle: {
              fontSize: 18,
              fontWeight: '600',
            },
            headerShadowVisible: false,
            headerTitleAlign: 'center',
            headerLargeTitle: false,
            headerBackButtonDisplayMode: 'generic',
            headerBackTitle: t('Back'),
            headerLeft: ({ canGoBack }) =>
              canGoBack ? undefined : (
                <IconButton icon='menu' onPress={() => setDrawerOpen(true)} />
              ),
            headerRight: () => <ConnectionDisplay />,
          }}
        >
          <Stack.Screen
            name="index"
            options={{
              headerShown: true,
              headerTitle: selectedVehicle?.name ?? ''
            }}
          />
          <Stack.Screen
            name="newplatform"
            options={{
              title: t('New Platform'),
            }}
          />
          <Stack.Screen
            name="newplatform/ovmsv2"
            options={{
              title: t('OVMS v2 API'),
            }}
          />
          <Stack.Screen
            name="newplatform/tesla"
            options={{
              title: t('TESLA API'),
            }}
          />
          <Stack.Screen
            name="controls"
            options={{
              title: t('Controls'),
            }}
          />
          <Stack.Screen
            name="climate"
            options={{
              title: t('Climate'),
            }}
          />
          <Stack.Screen
            name="charging"
            options={{
              title: t('Charging'),
            }}
          />
          <Stack.Screen
            name="location"
            options={{
              title: t('Location'),
            }}
          />
          <Stack.Screen
            name="messages"
            options={{
              title: t('Messages'),
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              title: t('Settings'),
            }}
          />
          <Stack.Screen
            name="settings/dashboard/[id]"
            options={{
              title: t('Edit Dashboard'),
            }}
          />
          <Stack.Screen
            name="dashboard/[id]"
            options={{
              title: t('Dashboard'),
            }}
          />
          <Stack.Screen
            name="developer/metrics"
            options={{
              title: t('Metrics'),
            }}
          />
          <Stack.Screen
            name="developer/aboutMetric"
            options={{
              title: 'About Metric',
            }}
          />
          <Stack.Screen
            name="editvehicle"
            options={{
              title: 'Edit Vehicle',
            }}
          />
          <Stack.Screen
            name="+not-found"
            options={{
              headerShown: false,
              title: 'Oops!'
            }}
          />
        </Stack>
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
    materialDark: { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...MaterialTheme.dark.colors } },
    materialLight: { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, ...MaterialTheme.light.colors } }
  });
  //@ts-ignore
  const theme = (colorScheme == 'dark') ? { ...MD3DarkTheme, colors: { ...MD3DarkTheme.colors, ...MaterialTheme.dark.colors } } : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, ...MaterialTheme.light.colors } };
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
                      {t('An update for the OVMS-X App is available. We suggest to install the update now, or you can skip it until later.')}
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
    </GestureHandlerRootView >
  );
});