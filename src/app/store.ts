import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import counterReducer from '../features/counter/counterSlice'
import realtimeDataReducer from '../slices/realtimeDataSlice'

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    realtimeData: realtimeDataReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
