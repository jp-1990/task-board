import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import listsReducer from "../components/list/listSlice";

export const store = configureStore({
  reducer: {
    lists: listsReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
