import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'

export interface StoredCommand {
  name: string,
  command: string,
  key: number,
  autosend : boolean
}

interface StoredCommandsState {
  nextKey: number,
  storedCommands: StoredCommand[]
}

const initialState: StoredCommandsState = {
  nextKey: 1,
  storedCommands: []
}

export const storedCommandsSlice = createSlice({
  name: 'storedCommands',
  initialState,
  reducers: {
    addCommand: (state: StoredCommandsState, action: PayloadAction<StoredCommand>) => {
      state.storedCommands.push(action.payload)
    },
    setCommand: (state: StoredCommandsState, action: PayloadAction<{ index: number, command: StoredCommand }>) => {
      if (state.storedCommands.length == 0) { state.nextKey = 0 }
      let key = state.nextKey
      if (typeof state.storedCommands[action.payload.index] === 'undefined') {
        state.storedCommands.push({ ...action.payload.command, key: key })
        state.nextKey += 1
      } else {
        key = state.storedCommands[action.payload.index].key
        state.storedCommands[action.payload.index] = { ...action.payload.command, key: key }
      }
    },
    removeCommand: (state: StoredCommandsState, action: PayloadAction<number>) => {
      state.storedCommands.splice(action.payload, 1)
    },
    wipeCommands: (state: StoredCommandsState) => {
      state.storedCommands = []
    },
    setCommands: (state: StoredCommandsState, action: PayloadAction<StoredCommand[]>) => {
      state.storedCommands = action.payload;
    },
    moveCommand: (state: StoredCommandsState, action: PayloadAction<{ from: number, to: number }>) => {
      var element = state.storedCommands[action.payload.from];
      state.storedCommands.splice(action.payload.from, 1);
      state.storedCommands.splice(action.payload.to, 0, element);
    }
  },
})

export const getCommands = (state: RootState) => state.storedCommands.storedCommands

export const { addCommand, removeCommand, wipeCommands, setCommands, setCommand } = storedCommandsSlice.actions
export default storedCommandsSlice.reducer
