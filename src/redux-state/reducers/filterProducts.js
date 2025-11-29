import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filterProducts: [
    {
      id: 1,
      name: "Всё",
      productList: [],
      isSystem: true,
    },
    {
      id: 2,
      name: "Избранное",
      productList: [],
      isSystem: true,
    },
  ],
};

export const filterProductsReducer = createSlice({
  name: "filterProducts",
  initialState,
  reducers: {
    changeFilterProducts: (state, action) => {
      state.filterProducts = action.payload;
    },

    addCategory: (state, action) => {
      const { categoryName } = action.payload;
      const trimmedName = categoryName.trim();
      const maxId = state.filterProducts.reduce(
        (max, category) => Math.max(max, category.id),
        0
      );
      const newId = maxId + 1;
      if (!state.filterProducts.some((x) => x.name === trimmedName)) {
        state.filterProducts.push({
          id: newId,
          name: trimmedName,
          productList: [],
          isSystem: false,
        });
      }
    },

    addProductToCategory: (state, action) => {
      const { categoryId, productId } = action.payload;
      const category = state.filterProducts.find(
        (cat) => cat.id === categoryId
      );
      if (category && !category.productList.includes(productId)) {
        category.productList.push(productId);
      }
    },

    removeProductFromCategory: (state, action) => {
      const { categoryId, productId } = action.payload;
      const category = state.filterProducts.find(
        (cat) => cat.id === categoryId
      );
      if (category) {
        category.productList = category.productList.filter(
          (id) => id !== productId
        );
      }
    },

    removeCategory: (state, action) => {
      const { categoryId } = action.payload;
      state.filterProducts = state.filterProducts.filter(
        (x) => x.id !== categoryId || x.isSystem
      );
    },

    removeProductFromAll: (state, action) => {
      const { productId } = action.payload;
      state.filterProducts.forEach((category) => {
        category.productList = category.productList.filter(
          (id) => id !== productId
        );
      });
    },
  },
});

export const {
  changeFilterProducts,
  addCategory,
  addProductToCategory,
  removeProductFromCategory,
  removeCategory,
  removeProductFromAll,
} = filterProductsReducer.actions;

export default filterProductsReducer.reducer;
