import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  compare_products: [],
}

export const productsCompareReducer = createSlice({
  name: 'compareProduct',
  initialState,
  reducers: {
    changeCompareProducts: (state, action) => {
        state.compare_products = action.payload
    }
  }
})

export const { changeCompareProducts } = productsCompareReducer.actions

export default productsCompareReducer.reducer