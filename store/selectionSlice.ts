import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'

interface SelectedState {
  selectedVehicle: string | null
}

const initialState: SelectedState = {
  selectedVehicle: null,
}

export const selectionSlice = createSlice({
  name: 'vehicles',
  initialState,
  reducers: {
    selectVehicle: (state, action: PayloadAction<string>) => {
      state.selectedVehicle = action.payload
    },
    unselectVehicle: (state) => { state.selectedVehicle = null }
  },
})

export const getSelectedVehicle = (state: RootState) => {
  if (state.selection.selectedVehicle != null) {
    for (let i = 0; i < state.vehicles.vehicles.length; i++) {
      if (state.vehicles.vehicles[i].key == state.selection.selectedVehicle) {
        return state.vehicles.vehicles[i]
      }
    }
  }
  return null
}

export const { selectVehicle , unselectVehicle } = selectionSlice.actions
export default selectionSlice.reducer
