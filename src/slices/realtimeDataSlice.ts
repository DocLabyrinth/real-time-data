import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../app/store'
import { fetchUserBrowserData, fetchUserDeviceData } from '../utils/google'
import { BarGraphData, SunburstData } from '../types'

interface RealtimeState {
  userBrowserData: BarGraphData
  userDeviceData: SunburstData
}

const initialState: RealtimeState = {
  userBrowserData: { keys: [], data: [] },
  userDeviceData: { name: '', children: [] }
}

export const realtimeDataSlice = createSlice({
  name: 'realtimeData',
  initialState,
  reducers: {
    updateBrowserData: (state, action: PayloadAction<BarGraphData>) => {
      state.userBrowserData = action.payload
    },
    clearBrowserData: state => {
      state.userBrowserData = initialState.userBrowserData
    },
    updateDeviceData: (state, action: PayloadAction<SunburstData>) => {
      state.userDeviceData = action.payload
    },
    clearDeviceData: state => {
      state.userDeviceData = initialState.userDeviceData
    }
  }
})

export const {
  updateBrowserData,
  updateDeviceData,
  clearBrowserData,
  clearDeviceData
} = realtimeDataSlice.actions

export const fetchBrowserData = (): AppThunk => dispatch => {
  fetchUserBrowserData()
    .then(newData => {
      if (newData === null) {
        // there are currently no active users, clear out the store
        updateBrowserData(initialState.userBrowserData)
        return
      }
      dispatch(updateBrowserData(newData))
    })
    .catch(err => {
      console.log('failed to fetch data', err)
    })
}

export const selectBrowserData = (state: RootState) =>
  state.realtimeData.userBrowserData

export const fetchDeviceData = (): AppThunk => dispatch => {
  fetchUserDeviceData()
    .then(newData => {
      if (newData === null) {
        // there are currently no active users, clear out the store
        updateDeviceData(initialState.userDeviceData)
        return
      }
      dispatch(updateDeviceData(newData))
    })
    .catch(err => {
      console.log('failed to fetch data', err)
    })
}

export const selectDeviceData = (state: RootState) =>
  state.realtimeData.userDeviceData

export default realtimeDataSlice.reducer
