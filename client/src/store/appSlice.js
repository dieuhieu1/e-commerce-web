import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "./asyncActions";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    categories: null,
    isLoading: false,
  },
  // This reducers contain and handle basic action (Sync Action)
  reducers: {},
  // This code will handle Async Action
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export default appSlice.reducer;
