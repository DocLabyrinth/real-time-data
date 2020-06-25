import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { AppThunk, RootState } from '../app/store'
import { fetchRealtimeData } from '../utils/google'
import { GraphData } from '../types'

interface RealtimeState {
  data: GraphData
}

const initialState: RealtimeState = {
  data: { keys: [], data: [] }
}

export const realtimeDataSlice = createSlice({
  name: 'realtimeData',
  initialState,
  reducers: {
    updateData: (state, action: PayloadAction<GraphData>) => {
      state.data = action.payload
    }
  }
})

export const { updateData } = realtimeDataSlice.actions

// The function below is called a thunk and allows us to perform async logic. It
// can be dispatched like a regular action: `dispatch(incrementAsync(10))`. This
// will call the thunk with the `dispatch` function as the first argument. Async
// code can then be executed and other actions can be dispatched

// export const incrementAsync = (amount: number): AppThunk => dispatch => {

export const fetchData = (): AppThunk => dispatch => {
  fetchRealtimeData()
    .then(newData => {
      if (newData === null) {
        // there are currently no active users, clear out the store
        updateData(initialState.data)
        return
      }
      dispatch(updateData(newData))
    })
    .catch(err => {
      console.log('failed to fetch data', err)
    })
}

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const selectData = (state: RootState) => state.realtimeData.data

export default realtimeDataSlice.reducer
