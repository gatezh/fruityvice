import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import fruitsReducer from './features/fruits/fruitsSlice';
import jarReducer from './features/jar/jarSlice';
import { fruityViceApi } from './services/fruityViceApi';

export const store = configureStore({
  reducer: {
    fruits: fruitsReducer,
    jar: jarReducer,
    [fruityViceApi.reducerPath]: fruityViceApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fruityViceApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
