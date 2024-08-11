import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const fruityViceApi = createApi({
  reducerPath: 'fruityViceApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://corsproxy.io/?https://www.fruityvice.com/api/fruit/' }),
  endpoints: (builder) => ({
    getFruits: builder.query({
      query: () => 'all',
    }),
  }),
});

export const { useGetFruitsQuery } = fruityViceApi;
