import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'

export enum VehicleConnectionState {
  DISCONNECTED = 'disconnected',
  WAITRECONNECT = 'waitreconnect',
  CONNECTING = 'connecting',
  AUTHENTICATING = 'authenticating',
  CONNECTED = 'connected',
  ERROR = 'error'
}
interface ConnectionState {
  connectionState: VehicleConnectionState
  carConnected: boolean
  lastUpdateTime: number
}

const initialState: ConnectionState = {
  connectionState: VehicleConnectionState.DISCONNECTED,
  carConnected: false,
  lastUpdateTime: 0,
}

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnectionState: (state, action: PayloadAction<VehicleConnectionState>) => {
      console.log("[connectionSlice] setConnectionState", action.payload)
      state.connectionState = action.payload
      },
    setCarConnected: (state, action: PayloadAction<boolean>) => { state.carConnected = action.payload },
    setLastUpdateTime: (state, action: PayloadAction<number>) => { state.lastUpdateTime = action.payload },
  },
})

export const getConnectionState = (state: RootState) => state.connection.connectionState
export const getCarConnected = (state: RootState) => state.connection.carConnected
export const getLastUpdateTime = (state: RootState) => state.connection.lastUpdateTime

export const { setConnectionState, setLastUpdateTime } = connectionSlice.actions
export default connectionSlice.reducer
