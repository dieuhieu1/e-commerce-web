import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiGetCategories } from "@/apis/app";

export const getCategories = createAsyncThunk(
  "app/products/categories",
  async (data, thunkAPI) => {
    try {
      const response = await apiGetCategories();

      return response.result;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response.data);
    }
  }
);
