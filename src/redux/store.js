import { configureStore,combineReducers} from '@reduxjs/toolkit'
import createChromeStorage from 'redux-persist-chrome-storage'
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
 } from 'redux-persist'
import productsReducer from './slices/products'
import filterProductsReducer from './slices/filterProducts'
import compareReducer from './slices/compareProducts'
import {api} from './api'

const storage = createChromeStorage(window.chrome, 'local');

const rootReducer = combineReducers({
  products: productsReducer,
  filterProducts: filterProductsReducer,
  compareProducts: compareReducer,
  [api.reducerPath]: api.reducer
})

const persistConfig = {
  key: 'root',
  storage,
  blacklist: [api.reducerPath] 
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,  

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
      }
    }).concat(api.middleware),
})

export const persistor = persistStore(store);
export default store;