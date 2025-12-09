import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  lastCompare: [],
}

export const compareReducer = createSlice({
  name: 'lastCompare',
  initialState,
  reducers: {  
    setProduct : (state,action) => {
      const { currentCompare } = action.payload;
      state.lastCompare = currentCompare
    },
  }
})

export const {
  setProduct} = compareReducer.actions

export default compareReducer.reducer