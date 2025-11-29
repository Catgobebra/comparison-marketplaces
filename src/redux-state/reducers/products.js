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
    },
    addProduct : (state,action) => {
      const {product,marketplace} = action.payload;
      const maxId = state.products.reduce(
        (max, category) => Math.max(max, category.id),
        0
      );
      const newId = maxId + 1;
      state.products.push(
        {
          id: newId,
          ...product,
          marketplaceName: marketplace,
          isSelected : false
        }
      )
    },
    
    removeProduct : (state,action) => {
      const { categoryId } = action.payload;
      state.products = state.products.filter((x) => x.id !== categoryId);
    }
  }
})

export const { changeProducts, addProduct, removeProduct } = productsReducer.actions

export default productsReducer.reducer