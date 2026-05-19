import { api } from "./baseApi.js";

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listAdminOrders: builder.query({
      query: () => "/admin/orders",
      providesTags: ["AdminOrders"],
    }),
    refundOrder: builder.mutation({
      query: (orderId) => ({ url: `/admin/orders/${orderId}/refund`, method: "POST" }),
      invalidatesTags: ["AdminOrders", "Order"],
    }),
  }),
});

export const { useListAdminOrdersQuery, useRefundOrderMutation } = adminApi;
