import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({baseUrl: 'http://localhost:5000/api/Products'}),
  keepUnusedDataFor: 30,
  endpoints: (builder) => ({
    getProductBySku: builder.query({
      query: (sku) => 
        ({
           url : `/by-sku/${sku}`,
           method: "GET",
           headers: { accept: "text/plain" }
        })
    }),
    getProductByUrl: builder.query({
      query: (url) => ({
        url : `by-url?url=${encodeURIComponent(url)}`,
        method: "GET",
        headers: {"accept": "text/plain"}
      })}),
    сompareProducts: builder.query({
      query: (products) => ({
        url : `/compare`,
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(products)
    })
    })
    }),
});

export const {
  useGetProductBySkuQuery,
  useGetProductByUrlQuery,
  useCompareProductsMutation
 } = api;