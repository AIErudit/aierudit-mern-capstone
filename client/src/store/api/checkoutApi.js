import { api } from "./baseApi.js";

export const checkoutApi = api.injectEndpoints({
  endpoints: (builder) => ({
    placeOrder: builder.mutation({
      query: (body) => ({ url: "/checkout/place-order", method: "POST", body }),
      invalidatesTags: ["Cart", "Order"],
    }),
  }),
});

export const { usePlaceOrderMutation } = checkoutApi;
