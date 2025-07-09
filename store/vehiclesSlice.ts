import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'

export interface Vehicle {
  vin : string,
  platform : string,
  platformKey : string,
  platformParameters: {},
  name: string,
}

interface VehiclesState {
  selectedVehicleIndex : number,
  vehicles: Array<Vehicle>
}

const initialState: VehiclesState = {
  selectedVehicleIndex: 0,
  vehicles: []
}

export const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<Vehicle>) => { state.vehicles = [...state.vehicles, action.payload] },
    updateSelectedVehicleIndex: (state, action: PayloadAction<number>) => { state.selectedVehicleIndex = action.payload },
    updateVehicleVIN: (state, action: PayloadAction<{index : number, newValue : string}>) => { state.vehicles[action.payload.index].vin = action.payload.newValue},
    updateVehiclePlatform: (state, action: PayloadAction<{index : number, newValue : string}>) => { state.vehicles[action.payload.index].platform = action.payload.newValue},
    updateVehiclePlatformKey: (state, action: PayloadAction<{index : number, newValue : string}>) => { state.vehicles[action.payload.index].platformKey = action.payload.newValue},
    updateVehicleName: (state, action: PayloadAction<{index : number, newValue : string}>) => { state.vehicles[action.payload.index].name = action.payload.newValue},
    removeVehicle: (state, action: PayloadAction<number>) => { state.vehicles.splice(action.payload, 1); state.selectedVehicleIndex = 0 },
    wipeVehicles: (state) => { state.vehicles = []},
  },
})

export const getSelectedVehicle = (state : RootState) => state.vehicles.vehicles[state.vehicles.selectedVehicleIndex]
export const getVehicles = (state : RootState) => state.vehicles.vehicles

export const { addVehicle, removeVehicle, updateSelectedVehicleIndex, updateVehicleName, updateVehiclePlatform, updateVehiclePlatformKey, updateVehicleVIN } = vehiclesSlice.actions
export default vehiclesSlice.reducer
