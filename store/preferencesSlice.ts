import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'
import { getLocales } from 'expo-localization'
import { Appearance, useColorScheme } from 'react-native'

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
  kPa = "kPa"
}

interface PreferencesState {
  temperatureChoice: TemperatureChoiceType,
  distanceChoice: DistanceChoiceType,
  pressureChoice: PressureChoiceType,
  colorMode: "light" | "dark" | null
}

const initialState: PreferencesState = {
  temperatureChoice: TemperatureChoiceType.SYSTEM,
  distanceChoice: DistanceChoiceType.SYSTEM,
  pressureChoice: PressureChoiceType.SYSTEM,
  colorMode: null
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
    },
    setColorScheme: (state, action : PayloadAction<"light" | "dark">) => {
      Appearance.setColorScheme(action.payload)
      state.colorMode = action.payload
    }
  },
})

export const getTemperaturePreference = (state: RootState) => {
  return state.preferences.temperatureChoice
}

export const getTemperatureUnit = (state: RootState) => {
  const locales = getLocales()
  if (state.preferences.temperatureChoice === TemperatureChoiceType.SYSTEM) {
    if (locales[0].temperatureUnit === 'celsius') {
      return 'C'
    } else {
      return 'F'
    }
  } else {
    return state.preferences.temperatureChoice.toString();
  }
}

export const getDistancePreference = (state: RootState) => {
  return state.preferences.distanceChoice
}

export const getDistanceUnit = (state: RootState) => {
  const locales = getLocales()
  if (state.preferences.distanceChoice === DistanceChoiceType.SYSTEM) {
    if (locales[0].measurementSystem === 'metric') {
      return 'km'
    } else {
      return 'mi'
    }
  } else {
    return state.preferences.distanceChoice.toString();
  }
}

export const getPressurePreference = (state: RootState) => {
  return state.preferences.pressureChoice
}

export const getPressureUnit = (state: RootState) => {
  const locales = getLocales()
  if (state.preferences.pressureChoice === PressureChoiceType.SYSTEM) {
    if (locales[0].measurementSystem === 'metric') {
      return 'bar'
    } else {
      return 'psi'
    }
  } else {
    return state.preferences.pressureChoice.toString();
  }
}

export const getColorScheme = (state : RootState) => {
  return state.preferences.colorMode
}

export const { setTemperaturePreference, setDistancePreference, setPressurePreference } = preferencesSlice.actions

export default preferencesSlice.reducer
