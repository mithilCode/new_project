import { configureStore } from "@reduxjs/toolkit";
// import { createReducer } from './reducers';
import rootReducer from "./reducers";
export function configureAppStore() {
  const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }),
  });

  return store;
}
