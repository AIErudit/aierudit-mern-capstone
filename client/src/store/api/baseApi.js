import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// The Vite dev server proxies /api/* to the Express server on :5000.
// In production you would set this from a runtime env var.
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    credentials: "include",
  }),
  tagTypes: ["Book", "Cart", "Order", "Me", "AdminOrders"],
  endpoints: () => ({}),
});
