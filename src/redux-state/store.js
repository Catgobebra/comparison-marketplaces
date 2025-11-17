import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './reducers/products'
import productsCompareReducer from  './reducers/compareProduct'
import selectedProductsReducer from  './reducers/selectedProducts'
import filterProductsReducer from './reducers/filterProducts'

export const store = configureStore({
  reducer: {
    products : productsReducer,
    compareProducts : productsCompareReducer,
    selectedProduct : selectedProductsReducer,
    filterProducts : filterProductsReducer
  }
})