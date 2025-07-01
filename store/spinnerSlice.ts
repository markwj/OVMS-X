import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/root'

// Define a type for the slice state
interface SpinnerState {
  value: number
}

// Define the initial state using that type
const initialState: SpinnerState = {
  value: 0,
}

export const spinnerSlice = createSlice({
  name: 'spinner',
  initialState,
  reducers: {
    spinDown: (state) => {
      if (state.value > 0) { state.value -= 1 }
    },
    spinUp: (state) => {
      state.value += 1
    },
    spinUpByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { spinDown, spinUp, spinUpByAmount } = spinnerSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const spinnerCount = (state: RootState) => state.spinner.value

export default spinnerSlice.reducer
