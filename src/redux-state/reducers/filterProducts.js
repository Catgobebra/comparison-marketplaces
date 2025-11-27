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
    },

    addCategory : (state,action) => {
      const trimmedName = action.payload.trim();
      if (!state.filterProducts[trimmedName]) {
        state.filterProducts[trimmedName] = [];
      }
    },

    addProductToCategory : (state,action) => {
        const currentProducts = state.filterProducts[action.payload.categoryName] || []
        const updatedFilters = {
          ...state.filterProducts,
          [action.payload.categoryName]: [...currentProducts, action.payload.productId]
        }
        state.filterProducts = updatedFilters
    },

    removeProductFromCategory : (state,action) => {
      const currentProducts = state.filterProducts[action.payload.categoryName] || []
      const updatedFilters = {
      ...state.filterProducts,
      [action.payload.categoryName]: currentProducts.filter(id => id !== action.payload.productId)
      }
      state.filterProducts = updatedFilters
    },

    removeCategory : (state,action) => {
      delete state.filterProducts[action.payload]
    },

    removeProductFromAll : (state,action) => {
      const updatedCategories = Object.keys(state.filterProducts).reduce((acc, categoryName) => {
        acc[categoryName] = state.filterProducts[categoryName].filter(id => id !== action.payload.productId);
        return acc;
      }, {})
      state.filterProducts = updatedCategories
    }
  }
})

export const { 
  changeFilterProducts,
  addCategory,
  addProductToCategory,
  removeProductFromCategory,
  removeCategory,
  removeProductFromAll
} = filterProductsReducer.actions

export default filterProductsReducer.reducer