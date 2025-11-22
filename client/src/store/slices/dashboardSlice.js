import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: {
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0
  },
  storeOwner: {
    store: null,
    raters: [],
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0
    }
  },
  loading: false,
  error: null
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.storeOwner.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.storeOwner.pagination.limit = action.payload;
      state.storeOwner.pagination.page = 1; 
    }
  }
});

export const { setPage, setLimit } = dashboardSlice.actions;

export default dashboardSlice.reducer;
