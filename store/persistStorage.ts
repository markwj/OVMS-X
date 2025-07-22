// A secure-as-we-can-be storage

import React from 'react';
import { MMKV } from 'react-native-mmkv'
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants, { ExecutionEnvironment } from 'expo-constants';

const isExpo = (Constants.executionEnvironment == ExecutionEnvironment.StoreClient);
const isWeb = (Platform.OS == 'web');

let storage: MMKV | null = null;

console.log('[persistStorage] platform is', Platform.OS, 'exec env is', Constants.executionEnvironment);

if (isExpo) {
  console.log('[persistStorage] create for EXPO');
  //AsyncStorage.removeItem('persist:ovms_vehicles');
} else if (isWeb) {
  console.log('[persistStorage] create for WEB');
} else {
  console.log('[persistStorage] create for mobile');
  storage = new MMKV({
    id: `ovms-app`,
    encryptionKey: '347d38822dbefe3018f44dc462090c4396dda807e811b5585899ec6f8388960a',
    readOnly: false
  })
  //storage.delete('persist:ovms_vehicles');
};

export const securePersistStorage: Storage = {

  getItem(key: string) {
    console.log('[persistStorage] getItem',key);
    if (isExpo) {
      return AsyncStorage.getItem(key);
    } else if (isWeb) {
      return Promise.resolve(null);
    } else {
      const value = storage?.getString(key);
      return Promise.resolve(value);
    }
  },

  setItem(key: string, value: string) {
    console.log('[persistStorage] setItem',key, value);
    if (isExpo) {
      return AsyncStorage.setItem(key, value);
    } else if (isWeb) {
      return Promise.resolve(true);
    } else {
      storage?.set(key, value);
      return Promise.resolve(true);
    }
  },

  removeItem(key: string) {
    console.log('[persistStorage] removeItem',key);
    if (isExpo) {
      return AsyncStorage.removeItem(key);
    } else if (isWeb) {
      return Promise.resolve();
    } else {
      storage?.delete(key);
      return Promise.resolve();
    }
  }

}
