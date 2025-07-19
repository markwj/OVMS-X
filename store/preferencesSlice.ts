import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'

export enum TemperatureChoiceType {
  SYSTEM = "system",
  CELSIUS = "C",
  FAHRENHEIT = "F"
}

export enum DistanceChoiceType {
  SYSTEM = "system",
  KILOMETERS = "km",
  MILES = "mi"
}

export enum PressureChoiceType {
  SYSTEM = "system",
  PSI = "psi",
  BAR = "bar",
  KPA = "kpa"
}

interface PreferencesState {
  temperatureChoice: TemperatureChoiceType,
  distanceChoice: DistanceChoiceType,
  pressureChoice: PressureChoiceType,
}

const initialState: PreferencesState = {
  temperatureChoice: TemperatureChoiceType.SYSTEM,
  distanceChoice: DistanceChoiceType.SYSTEM,
  pressureChoice: PressureChoiceType.SYSTEM,
}

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTemperaturePreference: (state, action: PayloadAction<TemperatureChoiceType>) => {
      state.temperatureChoice = action.payload
    },
    setDistancePreference: (state, action: PayloadAction<DistanceChoiceType>) => {
      state.distanceChoice = action.payload
    },
    setPressurePreference: (state, action: PayloadAction<PressureChoiceType>) => {
      state.pressureChoice = action.payload
    }
  },
})

export const getTemperaturePreference = (state: RootState) => {
  return state.preferences.temperatureChoice
}

export const getDistancePreference = (state: RootState) => {
  return state.preferences.distanceChoice
}

export const getPressurePreference = (state: RootState) => {
  return state.preferences.pressureChoice
}

export const { setTemperaturePreference, setDistancePreference, setPressurePreference } = preferencesSlice.actions

export default preferencesSlice.reducer
