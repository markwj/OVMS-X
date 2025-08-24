import { createSelector, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './root'
import { Dashboard } from '@/components/dashboard/types'
import { dashboardRegistry } from '@/components/dashboard/registry'

interface DashboardSliceState {
  definedDashboards: string[]
}

const initialState: DashboardSliceState = {
  definedDashboards: []
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addSerializedDashboard(state: DashboardSliceState, action: PayloadAction<string>) {
      state.definedDashboards.push(action.payload)
    },
    updateDashboard(state: DashboardSliceState, action: PayloadAction<{ index: number, newValue: string }>) {
      state.definedDashboards[action.payload.index] = action.payload.newValue
    },
    swapDashboards(state: DashboardSliceState, action: PayloadAction<{ from: number, to: number }>) {
      var element = state.definedDashboards[action.payload.from];
      state.definedDashboards.splice(action.payload.from, 1);
      state.definedDashboards.splice(action.payload.to, 0, element);
    },
    removeDashboard: (state: DashboardSliceState, action: PayloadAction<number>) => {
      state.definedDashboards.splice(action.payload, 1)
    },
    wipeDashboards: (state: DashboardSliceState) => {
      state.definedDashboards = []
    }
  },
})

export const selectSerializedDashboards = (state: RootState) => state.dashboard.definedDashboards

export const selectDashboards = createSelector(selectSerializedDashboards, (dbs) => dbs.map((d) => dashboardRegistry.parse(d)))

export const selectSerializedDashboard = (index: number) => {
  return createSelector(selectSerializedDashboards, (dashboards) => dashboards[index])
}

export const selectDashboard = (index: number) => {
  return createSelector(selectSerializedDashboard(index), (d) => dashboardRegistry.parse(d))
}

export const selectDashboardNames = createSelector(selectDashboards, (dbs) => dbs.map((db) => db?.name))

export const newBlankDashboard = ({ baseName, type, params }: { baseName?: string, type?: string, params?: string }) => {
  return createSelector(selectDashboards, (dbs) => {
    const names = new Set<string>()
    dbs.forEach((db) => {
      if (db == undefined) { return }
      names.add(db.name)
    })

    let newName = baseName ?? "New Dashboard"
    if (names.has(newName)) {
      let i = 1
      let trialNewName = `${newName} (${i})`
      while (names.has(trialNewName)) {
        i++
        trialNewName = `${newName} (${i})`

        if (i == 100) {
          break
        }
      }

      newName = trialNewName
    }

    return dashboardRegistry.generateDashboard({
      name: newName,
      type: type ?? "Blank",
      params: params ?? "{}"
    })!
  })
}

export const { addSerializedDashboard, swapDashboards, removeDashboard, wipeDashboards, updateDashboard } = dashboardSlice.actions
export default dashboardSlice.reducer
