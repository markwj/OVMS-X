import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GiftedChat, IMessage } from 'react-native-gifted-chat';
import { RootState } from './root';

const MESSAGES_STORE_CAP = 100;

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, action : PayloadAction<IMessage>) => {
      //@ts-ignore
      action.payload.createdAt = action.payload.createdAt.getTime()
      //@ts-ignore
      state.messages = [action.payload, ...state.messages]
      if(state.messages.length > MESSAGES_STORE_CAP) {
        state.messages.pop()
      }
    },
    addAppMessage: (state, action : PayloadAction<{text: string, currentTime : number}>) => {
      let newMessage : IMessage = {
        //@ts-ignore
        _id: state.messages[0]._id + 1,
        text: action.payload.text,
        createdAt: action.payload.currentTime,
        user: {_id : 1}
      }
      //@ts-ignore
      state.messages = [newMessage, ...state.messages]
      if(state.messages.length > MESSAGES_STORE_CAP) {
        state.messages.pop()
      }
    },
    addVehicleMessage: (state, action : PayloadAction<string>) => {
      let newMessage : IMessage = {
        //@ts-ignore
        _id: state.messages[0]._id + 1,
        text: action.payload,
        createdAt: Date.now(),
        user: {_id : 2}
      }
      //@ts-ignore
      state.messages = [newMessage, ...state.messages]
      if(state.messages.length > MESSAGES_STORE_CAP) {
        state.messages.pop()
      }
    }
  },
});


//@ts-ignore
export const selectMessages = (state : RootState) => state.messages.messages;

export const { addMessage, addVehicleMessage, addAppMessage } = messagesSlice.actions;
export default messagesSlice.reducer;