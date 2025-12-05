// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import tourismReducer from "./slices/tourismSlice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    tourism: tourismReducer,
    auth: authReducer,
  },
});

// ---- types for hooks ----
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
