import { configureStore } from '@reduxjs/toolkit';
import { globalReducer } from './slices/global';
import { aboutSliceReducer } from './slices/about'
import { supportReducer } from './slices/support'
import { profileReducer } from './slices/profile';
import { mapSliceReducer } from './slices/map';
import { mapApi } from './api/api';

export const store = configureStore({
  reducer: {
    [mapApi.reducerPath]: mapApi.reducer,
    global: globalReducer,
    about: aboutSliceReducer,
    support: supportReducer,
    profile: profileReducer,
    map: mapSliceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(mapApi.middleware)
});
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
