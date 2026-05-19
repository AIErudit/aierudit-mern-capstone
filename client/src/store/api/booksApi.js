import { api } from "./baseApi.js";

export const booksApi = api.injectEndpoints({
  endpoints: (builder) => ({
    listBooks: builder.query({
      query: ({ q = "", page = 1 } = {}) =>
        `/books?page=${page}&pageSize=20${q ? `&q=${encodeURIComponent(q)}` : ""}`,
      providesTags: ["Book"],
    }),
    getBook: builder.query({
      query: (id) => `/books/${id}`,
      providesTags: (_r, _e, id) => [{ type: "Book", id }],
    }),
  }),
});

export const { useListBooksQuery, useGetBookQuery } = booksApi;
