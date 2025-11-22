import { apiSlice } from './apiSlice';

export const storeApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getStores: builder.query({
      query: ({ page = 1, limit = 10, filters = {} }) => {
        let queryParams = `page=${page}&limit=${limit}`;
        
        // Add filters to query params if they exist
        if (filters.name) queryParams += `&name=${filters.name}`;
        if (filters.email) queryParams += `&email=${filters.email}`;
        if (filters.address) queryParams += `&address=${filters.address}`;
        
        return `/stores?${queryParams}`;
      },
      providesTags: (result) => 
        result
          ? [
              ...result.data.map(({ id }) => ({ type: 'Store', id })),
              { type: 'Store', id: 'LIST' }
            ]
          : [{ type: 'Store', id: 'LIST' }]
    }),
    getStoreById: builder.query({
      query: (id) => `/stores/${id}`,
      providesTags: (result, error, id) => [{ type: 'Store', id }]
    }),
    createStore: builder.mutation({
      query: (storeData) => ({
        url: '/stores',
        method: 'POST',
        body: storeData
      }),
      invalidatesTags: [{ type: 'Store', id: 'LIST' }]
    }),
    updateStore: builder.mutation({
      query: ({ id, ...storeData }) => ({
        url: `/stores/${id}`,
        method: 'PUT',
        body: storeData
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Store', id },
        { type: 'Store', id: 'LIST' }
      ]
    }),
    deleteStore: builder.mutation({
      query: (id) => ({
        url: `/stores/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: [{ type: 'Store', id: 'LIST' }]
    }),
    getStoreRaters: builder.query({
      query: ({ id, page = 1, limit = 10 }) => `/stores/${id}/raters?page=${page}&limit=${limit}`,
      providesTags: (result, error, { id }) => [
        { type: 'Store', id: `RATERS-${id}` }
      ]
    }),
    getAllStores: builder.query({
      query: ({ page = 1, limit = 8, name = '', address = '' }) => {
        let params = `?page=${page}&limit=${limit}`;
        if (name) params += `&name=${encodeURIComponent(name)}`;
        if (address) params += `&address=${encodeURIComponent(address)}`;
        return `/stores${params}`;
      },
    })
  })
});

export const {
  useGetStoresQuery,
  useGetStoreByIdQuery,
  useCreateStoreMutation,
  useUpdateStoreMutation,
  useDeleteStoreMutation,
  useGetStoreRatersQuery,
  useGetAllStoresQuery
} = storeApiSlice;

// Alias for backward compatibility
// export const useGetAllStoresQuery = useGetStoresQuery;
