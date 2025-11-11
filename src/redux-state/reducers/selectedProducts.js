import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  selectedProducts: [],
}

export const selectedProductsReducer = createSlice({
  name: 'selectedProducts',
  initialState,
  reducers: {
    changeSelectedProducts : (state,action) => {
        state.selectedProducts = action.payload
    }
  }
})

export const { changeSelectedProducts} = selectedProductsReducer.actions

export default selectedProductsReducer.reducer