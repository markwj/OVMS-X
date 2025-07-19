import { configureStore } from '@reduxjs/toolkit'
import spinnerReducer from '@/store/spinnerSlice';
import vehiclesReducer from '@/store/vehiclesSlice';
import metricsReducer from '@/store/metricsSlice';
import messagesReducer from '@/store/messagesSlice';
import connectionReducer from '@/store/connectionSlice';
import selectionReducer from '@/store/selectionSlice';
import preferencesReducer from '@/store/preferencesSlice';
import { ovmsv2wsApi } from '@/store/ovmsv2wsApi';
import { ovmsv2httpApi } from '@/store/ovmsv2httpApi';
import {
  persistStore, persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import { securePersistStorage } from '@/store/persistStorage';

const vehiclesPersistConfig = {
  key: 'ovms_vehicles',
  version: 1,
  storage: securePersistStorage,
}

const messagesPersistConfig = {
  key: 'messages',
  version: 1,
  storage: securePersistStorage,
}

const selectionPersistConfig = {
  key: 'selection',
  version: 1,
  storage: securePersistStorage,
}

const preferencesPersistConfig = {
  key: 'preferences',
  version: 1,
  storage: securePersistStorage,
}

export const store = configureStore({
  reducer: {
    spinner: spinnerReducer,
    metrics: metricsReducer,
    connection: connectionReducer,
    [ovmsv2wsApi.reducerPath]: ovmsv2wsApi.reducer,
    [ovmsv2httpApi.reducerPath]: ovmsv2httpApi.reducer,
    //@ts-ignore
    messages : persistReducer(messagesPersistConfig, messagesReducer),
    //@ts-ignore
    vehicles: persistReducer(vehiclesPersistConfig, vehiclesReducer),
    //@ts-ignore
    selection: persistReducer(selectionPersistConfig, selectionReducer),
    //@ts-ignore
    preferences: persistReducer(preferencesPersistConfig, preferencesReducer)
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(ovmsv2wsApi.middleware).concat(ovmsv2httpApi.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const persistedStore = persistStore(store)
