import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from './root';

const MESSAGES_STORE_CAP = 100;

const initialState = {
  messages: [],
};

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action : PayloadAction<any>) => {
      //@ts-ignore
      action.payload.createdAt = action.payload.createdAt.getTime()
      //@ts-ignore
      state.messages = [action.payload, ...state.messages]
      if(state.messages.length > MESSAGES_STORE_CAP) {
        state.messages.pop()
      }
    },
    addAppMessage: (state, action : PayloadAction<{text: string, currentTime : number, vehicleKey? : string}>) => { //Add vehicle key - default null
      let newMessage = {
        //@ts-ignore
        _id: (state.messages[0]?._id ?? -1) + 1,
        text: action.payload.text,
        vehicleKey: action.payload.vehicleKey ?? null,
        createdAt: action.payload.currentTime,
        user: {_id : 1}
      }
      //@ts-ignore
      state.messages = [newMessage, ...state.messages]
      if(state.messages.length > MESSAGES_STORE_CAP) {
        state.messages.pop()
      }
    },
    addVehicleMessage: (state, action : PayloadAction<{text : string, vehicleKey? : string}>) => {
      let newMessage = {
        //@ts-ignore
        _id: (state.messages[0]?._id ?? -1) + 1,
        text: action.payload.text,
        vehicleKey: action.payload.vehicleKey ?? null,
        createdAt: Date.now(),
        user: {_id : 2}
      }
      //@ts-ignore
      state.messages = [newMessage, ...state.messages]
      if(state.messages.length > MESSAGES_STORE_CAP) {
        state.messages.pop()
      }
    },
    wipeMessages: (state) => {
      state.messages = []
    }
  },
});


//@ts-ignore
export const selectMessages = (state : RootState) => state.messages.messages; 
//Add selector where messages have vehicle key specified or null

export function generateSelectVehicleMessages(vehicleKey : string) {
  //@ts-ignore
  return createSelector(selectMessages, (messages) => messages.filter((m) => [null, vehicleKey].includes(m.vehicleKey)))
}

export const { addMessage, addVehicleMessage, addAppMessage, wipeMessages } = messagesSlice.actions;
export default messagesSlice.reducer;