import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/root'

// Define a type for the slice state
interface VehiclesState {
  vehicles: Array
}

// Define the initial state using that type
const initialState: VehiclesState = {
  vehicles: [{vin:1},{vin:2},{vin:3}]
}

export const vehiclesSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    addVehicle: (state, action: PayloadAction<string>) => { },
    removeVehicle: (state, action: PayloadAction<string>) => { },
  },
})

export const { addVehicle, removeVehicle } = vehiclesSlice.actions
export const vehicles = (state: RootState) => state.vehicles.vehicles
export default vehiclesSlice.reducer
