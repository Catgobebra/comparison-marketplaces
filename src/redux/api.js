import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000/api/Products'}),
  endpoints: (builder) => ({
    getProductBySku: builder.query({
      query: (sku) => 
        ({
           url : `/by-sku-ozon/${sku}`,
           method: "GET",
           headers: { accept: "text/plain" }
        }),
    }),
    getProductByUrl: builder.query({
      query: (url) => ({
        url : `by-url?url=${encodeURIComponent(url)}`,
        method: "GET",
        headers: {"accept": "text/plain"}
      }),
    }),
    getCompareProducts: builder.query({
      query: (products) => ({
        url : `/compare`,
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(products)
      }),
      transformResponse: (response) => response.result,
      timeout: 50000
    })
    }),
});

export const {
  useLazyGetProductBySkuQuery,
  useGetProductByUrlQuery,
  useLazyGetProductByUrlQuery,
  useGetCompareProductsQuery,
 } = api;

 