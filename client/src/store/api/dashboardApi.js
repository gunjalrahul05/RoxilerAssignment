import { apiSlice } from './apiSlice';

export const dashboardApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => '/dashboard/admin',
      providesTags: ['Dashboard']
    }),
    getStoreOwnerDashboard: builder.query({
      query: ({ page = 1, limit = 10 } = {}) => `/dashboard/store-owner?page=${page}&limit=${limit}`,
      providesTags: ['Dashboard']
    })
  })
});

export const {
  useGetAdminDashboardQuery,
  useGetStoreOwnerDashboardQuery
} = dashboardApiSlice;
