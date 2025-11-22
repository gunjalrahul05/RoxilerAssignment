import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: [],
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  },
  filters: {
    name: '',
    email: '',
    address: '',
    role: ''
  },
  loading: false,
  error: null
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.pagination.page = 1; 
    },
    clearFilters: (state) => {
      state.filters = {
        name: '',
        email: '',
        address: '',
        role: ''
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

export const { setFilters, clearFilters, setPage, setLimit } = userSlice.actions;

export default userSlice.reducer;
