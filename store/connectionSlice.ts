import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'

export enum VehicleConnectionState {
  DISCONNECTED = 'disconnected',
  CONNECTING = 'connecting',
  AUTHENTICATING = 'authenticating',
  CONNECTED = 'connected',
  ERROR = 'error'
}
interface ConnectionState {
  connectionState: VehicleConnectionState
  lastUpdateTime: number
}

const initialState: ConnectionState = {
  connectionState: VehicleConnectionState.DISCONNECTED,
  lastUpdateTime: 0,
}

export const connectionSlice = createSlice({
  name: 'connection',
  initialState,
  reducers: {
    setConnectionState: (state, action: PayloadAction<VehicleConnectionState>) => { state.connectionState = action.payload },
    setLastUpdateTime: (state, action: PayloadAction<number>) => { state.lastUpdateTime = action.payload },
  },
})

export const getConnectionState = (state: RootState) => state.vehicles.connectionState
export const getLastUpdateTime = (state: RootState) => state.vehicles.lastUpdateTime

export const { setConnectionState, setLastUpdateTime } = connectionSlice.actions
export default connectionSlice.reducer
