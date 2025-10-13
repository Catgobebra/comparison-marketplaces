import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './reducers/products'
import productsCompareReducer from  './reducers/compareProduct'

export const store = configureStore({
  reducer: {
    products : productsReducer,
    compareProducts : productsCompareReducer
  }
})