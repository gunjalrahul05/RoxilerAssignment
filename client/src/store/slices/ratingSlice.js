import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  ratings: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {
    userId: '',
    storeId: '',
    minRating: '',
    maxRating: ''
  },
  loading: false,
  error: null
};

const ratingSlice = createSlice({
  name: 'ratings',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; 
    },
    clearFilters: (state) => {
      state.filters = {
        userId: '',
        storeId: '',
        minRating: '',
        maxRating: ''
      };
      state.pagination.page = 1;
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload;
    },
    setLimit: (state, action) => {
      state.pagination.limit = action.payload;
      state.pagination.page = 1; 
    }
  }
});

export const { setFilters, clearFilters, setPage, setLimit } = ratingSlice.actions;

export default ratingSlice.reducer;
