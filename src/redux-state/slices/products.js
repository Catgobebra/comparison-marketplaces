import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [],
}

export const productsReducer = createSlice({
  name: 'products',
  initialState,
  reducers: {
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
          productItem : product,
          marketplaceName: marketplace,
          isSelected : false
        }
      )
    },
    
    removeProduct : (state,action) => {
      const { categoryId } = action.payload;
      state.products = state.products.filter((x) => x.id !== categoryId);
    },

    addToSelected : (state,action) => {
      const { categoryId } = action.payload;
      const product = state.products.find((x) => x.id === categoryId);
      product.isSelected = true
    },

    removeFromSelected : (state,action) => {
      const { categoryId } = action.payload;
      const product = state.products.find((x) => x.id === categoryId);
      product.isSelected = false
    }
  }
})

export const {
  addProduct,
  removeProduct, 
  addToSelected, 
  removeFromSelected} = productsReducer.actions

export default productsReducer.reducer