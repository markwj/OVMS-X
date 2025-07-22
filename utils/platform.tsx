import { Platform } from 'react-native';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import * as Device from 'expo-device';

export const isExpo   = (Constants.executionEnvironment == ExecutionEnvironment.StoreClient);
export const isWeb    = (Platform.OS == 'web');
export const isMobile = !isWeb;
export const os       = (Constants.executionEnvironment == ExecutionEnvironment.StoreClient)
                        ? 'Expo'
                        : Platform.OS;

export function getApplication() {
  let name = Device.modelName;

  const application = 'Network Box User App ' + os + ' on ' + Platform.OS + ' ' + name;
  console.log('[Platform] application %O',application);

  return application;
}

console.log('[Platform] %O model=%Oenvironment=%O isExpo=%O isWeb=%O isMobile=%O',
   Platform.OS,
   Device.modelName,
   Constants.executionEnvironment,
   isExpo,
   isWeb,
   isMobile
  );

