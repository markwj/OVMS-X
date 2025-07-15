import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'

export interface VehicleImage {
  imageName: string | null,
  tintColor: string | null,
  customPath: string | null
}
export interface Vehicle {
  key: string
  vin: string,
  name: string,
  platform: string,
  platformKey: string,
  platformParameters: {
    server?: string;
    httpsport?: string;
    wssport?: string;
    username?: string;
    password?: string;
    id?: string;
    [key: string]: any;
  },
  image: VehicleImage,
}
interface VehiclesState {
  vehicles: Array<Vehicle>
}

const initialState: VehiclesState = {
  vehicles: []
}

export const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {

    addVehicle: (state, action: PayloadAction<Vehicle>) => {
      const keys = state.vehicles.map((v) => v.key)
      const vehicleIndex = keys.indexOf(action.payload.key)
      if (vehicleIndex > -1) {
        state.vehicles[vehicleIndex] = action.payload
        return;
      }
      state.vehicles = [...state.vehicles, action.payload]
    },

    updateVehicleVIN: (state, action: PayloadAction<{ key: string, newValue: string }>) => {
      const keys = state.vehicles.map((v) => v.key)
      const vehicleIndex = keys.indexOf(action.payload.key)
      if (vehicleIndex > -1) {
        state.vehicles[vehicleIndex].vin = action.payload.newValue
        return;
      }
    },

    updateVehicleName: (state, action: PayloadAction<{ key: string, newValue: string }>) => {
      const keys = state.vehicles.map((v) => v.key)
      const vehicleIndex = keys.indexOf(action.payload.key)
      if (vehicleIndex > -1) {
        state.vehicles[vehicleIndex].name = action.payload.newValue
        return;
      }
    },

    updateVehicleImage: (state, action: PayloadAction<{ key : string, newValue: VehicleImage }>) => { 
      const keys = state.vehicles.map((v) => v.key)
      const vehicleIndex = keys.indexOf(action.payload.key)
      if (vehicleIndex > -1) {
        state.vehicles[vehicleIndex].image = action.payload.newValue
        return;
      }
    },

    removeVehicle: (state, action: PayloadAction<string>) => { 
      const keys = state.vehicles.map((v) => v.key)
      const vehicleIndex = keys.indexOf(action.payload)
      if (vehicleIndex > -1) {
        state.vehicles.splice(vehicleIndex, 1) 
        return;
      }
    },

    wipeVehicles: (state) => { state.vehicles = []; },

  },
})

function FindVehicle(state: RootState, key: string) {
  for (let i = 0; i < state.vehicles.vehicles.length; i++) {
    if (state.vehicles.vehicles[i].key == key) {
      return state.vehicles.vehicles[i]
    }
  }
  return null
}

export function generateFindVehicleSelector(key: string) {
  return (state: RootState) => FindVehicle(state, key)
}

export const getVehicles = (state: RootState) => state.vehicles.vehicles

export const { addVehicle, removeVehicle, updateVehicleName, updateVehicleVIN, wipeVehicles, updateVehicleImage } = vehiclesSlice.actions
export default vehiclesSlice.reducer
