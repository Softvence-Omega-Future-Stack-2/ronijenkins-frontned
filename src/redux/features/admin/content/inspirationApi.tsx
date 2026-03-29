import { baseAPI } from "../../../api/baseApi";

export const inspirationApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getInspirations: builder.query({
      query: ({ ordering, page, search }) => ({
        url: "/inspiration/",
        method: "GET",
        params: { ordering, page, search },
      }),
      providesTags: (result) =>
        result?.results
          ? [
              ...result.results.map(({ id }: { id: number }) => ({
                type: "Inspiration" as const,
                id,
              })),
              { type: "Inspiration" as const, id: "LIST" },
            ]
          : [{ type: "Inspiration" as const, id: "LIST" }],
    }),

    createInspiration: builder.mutation({
      query: (data) => ({
        url: "/inspiration/",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Inspiration", id: "LIST" }], // ✅
    }),

    getSingleInspiration: builder.query({
      query: (id: number) => ({
        url: `/inspiration/${id}/`,
        method: "GET",
      }),
      providesTags: (_result, _err, id) => [{ type: "Inspiration", id }],
    }),

    updateInspiration: builder.mutation({
      query: ({ id, inspiration }) => ({
        url: `/inspiration/${id}/`,
        method: "PUT",
        body: { inspiration },
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: "Inspiration", id },
        { type: "Inspiration", id: "LIST" },
      ], // ✅
    }),

    deleteInspiration: builder.mutation({
      query: (id: number) => ({
        url: `/inspiration/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _err, id) => [
        { type: "Inspiration", id },
        { type: "Inspiration", id: "LIST" },
      ], // ✅
    }),
  }),
});

export const {
  useGetInspirationsQuery,
  useCreateInspirationMutation,
  useGetSingleInspirationQuery,
  useUpdateInspirationMutation,
  useDeleteInspirationMutation,
} = inspirationApi;