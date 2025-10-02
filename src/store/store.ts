import { combineReducers } from 'redux'
import { configureStore, Middleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { authApi } from '@/store/services/auth-api'
import { persistReducer, persistStore } from 'redux-persist'
import storage from './useWebStorage'
import authReducer from '@/store/slices/auth-slice'
import projectReducer from "@/store/slices/project-slice"
import animalReducer from "@/store/slices/animal-slice"
import plantReducer from "@/store/slices/plant-slice"
import userReducer from "@/store/slices/user-slice"

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ["authApi"],
}

const allReducers = combineReducers({
  auth: authReducer,
  project: projectReducer,
  animal: animalReducer,
  plant: plantReducer,
  user: userReducer,
  [authApi.reducerPath]: authApi.reducer,
})

const persistedReducer = persistReducer(persistConfig, allReducers)

export const makeStore = () => {
  const store: any = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== 'production',
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        },
      }).concat(authApi.middleware as Middleware<{}, RootState>),
  })

  setupListeners(store.dispatch)

  return store
}

export const store = makeStore()

export const persistor = persistStore(store)

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
