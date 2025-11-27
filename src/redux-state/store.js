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
import productsReducer from './reducers/products'
import productsCompareReducer from  './reducers/compareProduct'
import selectedProductsReducer from  './reducers/selectedProducts'
import filterProductsReducer from './reducers/filterProducts'
import {api} from './api'

const storage = createChromeStorage(window.chrome, 'local');

const rootReducer = combineReducers({
  products: productsReducer,
  compareProducts: productsCompareReducer,
  selectedProduct: selectedProductsReducer,
  filterProducts: filterProductsReducer,
  [api.reducerPath]: api.reducer
})

const persistConfig = {
  key: 'root',
  storage,
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