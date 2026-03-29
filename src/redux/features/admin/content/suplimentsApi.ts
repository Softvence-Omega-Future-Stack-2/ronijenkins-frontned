import { baseAPI } from "../../../api/baseApi";


export interface Supplement {
  id?: number;
  supplement_name: string;
  description: string;
  image?: string;
  work_with?: string;
  avoid_with?: string;
  primary_benefits?: string;
  signs_of_deficiency?: string;
  children_dosage?: string;
  adult_dosage?: string;
  side_effects?: string;
  created_at?: string;
  updated_at?: string;
}

export interface SupplementResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Supplement[];
}

export const supplementApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET all
getSupplements: builder.query<SupplementResponse, { page: number }>({
  query: ({ page }) => `/supplements/?page=${page}`,
  providesTags: ["Supplement"],
}),

    // GET by ID
    getSupplementById: builder.query<Supplement, number>({
      query: (id) => `/supplements/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Supplement", id }],
    }),

    // POST
   addSupplement: builder.mutation<Supplement, FormData>({
      query: (newSupplement) => ({
        url: "/supplements/",
        method: "POST",
        body: newSupplement,
      }),
      invalidatesTags: ["Supplement"],
    }),

    // PATCH
    updateSupplement: builder.mutation<Supplement, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/supplements/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Supplement", id } , "Supplement"],
    }),

    // DELETE
    deleteSupplement: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/supplements/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [{ type: "Supplement", id }, "Supplement"],
    }),
  }),
  overrideExisting: true,
});

// Auto-generated hooks
export const {
  useGetSupplementsQuery,
  useGetSupplementByIdQuery,
  useAddSupplementMutation,
  useUpdateSupplementMutation,
  useDeleteSupplementMutation,
} = supplementApi;