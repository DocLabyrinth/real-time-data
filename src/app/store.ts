import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import realtimeDataReducer from '../slices/realtimeDataSlice'

export const store = configureStore({
  reducer: {
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
