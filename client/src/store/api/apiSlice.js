import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
  credentials: 'include'
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {

    const refreshResult = await baseQuery(
      { url: '/auth/refresh-token', method: 'POST', body: { refreshToken: localStorage.getItem('refreshToken') } },
      api,
      extraOptions
    );

    if (refreshResult.data) {

      api.dispatch({
        type: 'auth/setCredentials',
        payload: {
          token: refreshResult.data.token,
          refreshToken: refreshResult.data.refreshToken
        }
      });


      result = await baseQuery(args, api, extraOptions);
    } else {

      api.dispatch({ type: 'auth/logoutUser' });
    }
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Store', 'Rating', 'Dashboard'],
  endpoints: () => ({})
});
