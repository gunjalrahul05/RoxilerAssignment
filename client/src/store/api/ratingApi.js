import { apiSlice } from './apiSlice';

export const ratingApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getRatings: builder.query({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        let queryParams = `page=${page}&limit=${limit}`;
        
        // Add filters to query params if they exist
        if (filters.userId) queryParams += `&userId=${filters.userId}`;
        if (filters.storeId) queryParams += `&storeId=${filters.storeId}`;
        if (filters.minRating) queryParams += `&minRating=${filters.minRating}`;
        if (filters.maxRating) queryParams += `&maxRating=${filters.maxRating}`;
        
        return `/ratings?${queryParams}`;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Rating', id })),
              { type: 'Rating', id: 'LIST' }
            ]
          : [{ type: 'Rating', id: 'LIST' }]
    }),
    getUserRatingForStore: builder.query({
      query: (storeId) => `/ratings/store/${storeId}`,
      providesTags: (result, error, storeId) => [
        { type: 'Rating', id: `USER-STORE-${storeId}` }
      ]
    }),
    submitRating: builder.mutation({
      query: (ratingData) => ({
        url: '/ratings',
        method: 'POST',
        body: ratingData
      }),
      invalidatesTags: (result, error, { store_id }) => [
        { type: 'Rating', id: `USER-STORE-${store_id}` },
        { type: 'Rating', id: 'LIST' },
        { type: 'Store', id: store_id },
        { type: 'Store', id: 'LIST' }
      ]
    }),
    getTotalRatingsCount: builder.query({
      query: () => '/ratings/count',
      providesTags: ['Rating']
    })
  })
});

export const {
  useGetRatingsQuery,
  useGetUserRatingForStoreQuery,
  useSubmitRatingMutation,
  useGetTotalRatingsCountQuery
} = ratingApiSlice;
