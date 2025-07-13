import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const ovmsv2httpApi = createApi({
  reducerPath: 'ovmsv2httpApi',
  tagTypes: [
  ],
  refetchOnFocus: false,        // Fetch when app gains focus
  refetchOnReconnect: true,     // Fetch on network reconnection
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  endpoints: (builder) => ({
    getVehicles: builder.query({
      query: ({ url, username, password }) => ({
        url: url,
        method: 'GET',
        params: {
          'username': username,
          'password': password
        }
      })
    }),
  }),
})

export const {
  useGetVehiclesQuery,
  useLazyGetVehiclesQuery
} = ovmsv2httpApi
