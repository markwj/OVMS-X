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
  platformParameters: {},
  image: VehicleImage,
}

interface VehiclesState {
  selectedVehicle: string | null
  vehicles: Array<Vehicle>
}

const initialState: VehiclesState = {
  selectedVehicle: null,
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
    selectVehicle: (state, action: PayloadAction<string>) => {
      state.selectedVehicle = action.payload
    },
    updateVehicleVIN: (state, action: PayloadAction<{ index: number, newValue: string }>) => { state.vehicles[action.payload.index].vin = action.payload.newValue },
    updateVehicleName: (state, action: PayloadAction<{ index: number, newValue: string }>) => { state.vehicles[action.payload.index].name = action.payload.newValue },
    updateVehicleImage: (state, action: PayloadAction<{ index: number, newValue: VehicleImage }>) => { state.vehicles[action.payload.index].image = action.payload.newValue },
    removeVehicle: (state, action: PayloadAction<number>) => { state.vehicles.splice(action.payload, 1) },
    wipeVehicles: (state) => { state.vehicles = []; state.selectedVehicle = null; },
    unselectVehicle: (state) => { state.selectedVehicle = null }
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
export const getSelectedVehicle = (state: RootState) => (state.vehicles.selectedVehicle != null ? FindVehicle(state, state.vehicles.selectedVehicle) : null)
export const getVehicles = (state: RootState) => state.vehicles.vehicles

export const { addVehicle, removeVehicle, selectVehicle, updateVehicleName, updateVehicleVIN, unselectVehicle, wipeVehicles, updateVehicleImage } = vehiclesSlice.actions
export default vehiclesSlice.reducer
