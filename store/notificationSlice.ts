import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '@/store/root'

// Define a type for the slice state
interface NotificationState {
  enabled: boolean,
  token: string | null,
  uniqueID: string | null
}

// Define the initial state using that type
const initialState: NotificationState = {
  enabled: false,
  token: null,
  uniqueID: null,
}

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload
      state.enabled = true
    },
    setUniqueID: (state, action: PayloadAction<string>) => {
      state.uniqueID = action.payload
    }
  },
})

export const { setToken, setUniqueID } = notificationSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const notificationsToken = (state: RootState) => state.notification.token
export const notificationsEnabled = (state: RootState) => state.notification.enabled
export const notificationsUniqueID = (state: RootState) => state.notification.uniqueID

export default notificationSlice.reducer
