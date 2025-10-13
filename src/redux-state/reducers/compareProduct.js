import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  compare_product: [],
}

export const productsCompareReducer = createSlice({
  name: 'compareProduct',
  initialState,
  reducers: {
    changeProducts : (state,action) => {
        state.products = action.payload
    }
  }
})

export const { changeProducts } = productsCompareReducer.actions

export default productsCompareReducer.reducer