import { apiSlice } from './apiSlice';

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials
      })
    }),
    register: builder.mutation({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData
      })
    }),
    getCurrentUser: builder.query({
      query: () => '/auth/me',
      providesTags: ['User']
    }),
    updatePassword: builder.mutation({
      query: (passwordData) => ({
        url: '/auth/password',
        method: 'PUT',
        body: passwordData
      })
    }),
    logout: builder.mutation({
      query: () => ({
        url: '/auth/logout',
        method: 'POST'
      })
    })
  })
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetCurrentUserQuery,
  useUpdatePasswordMutation,
  useLogoutMutation
} = authApiSlice;
