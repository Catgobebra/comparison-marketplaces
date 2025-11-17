import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  filterProducts: {"Всё" : [], "Избранное" : []},
}

export const filterProductsReducer = createSlice({
  name: 'filterProducts',
  initialState,
  reducers: {
    changeFilterProducts : (state,action) => {
        state.filterProducts = action.payload
    }
  }
})

export const { changeFilterProducts} = filterProductsReducer.actions

export default filterProductsReducer.reducer