import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
}

export const productsReducer = createSlice({
  name: 'products',
  initialState,
  reducers: {
    changeProducts : (state,action) => {
        state.products = action.payload
    }
  }
})

export const { changeProducts } = productsReducer.actions

export default productsReducer.reducer