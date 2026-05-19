import { api } from "./baseApi.js";

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    myOrders: builder.query({
      query: () => "/orders/mine",
      providesTags: ["Order"],
    }),
    getOrder: builder.query({
      query: (id) => `/orders/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Order", id }],
    }),
  }),
});

export const { useMyOrdersQuery, useGetOrderQuery } = ordersApi;
