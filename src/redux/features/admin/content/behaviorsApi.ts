/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseAPI } from "../../../api/baseApi";

export type BehaviorCategory = "physical" | "sensory" | "emotional" | "digestive";

export interface Behavior {
  id: number;
  behavior_name?: string;
  behavior_category?: BehaviorCategory;
  behavior_description?: string;
  possible_root_causes?: string;
  suggested_protocol_ids?: number[];
  recommended_labs?: string;
  recommended_foods?: string;
  foods_to_avoid?: string;
  image?: string;
  supplements_name?: string[];
  supplements_images?: string[];
  protocol_count?: number;
  root_causes?: string;
  supplement_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface BehaviorListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Behavior[];
}

const buildFormData = (data: any): FormData => {
  const formData = new FormData();

  formData.append('behavior_name', data.behavior_name);
  formData.append('behavior_category', data.behavior_category);

  if (data.behavior_description) formData.append('behavior_description', data.behavior_description);
  if (data.possible_root_causes) formData.append('possible_root_causes', data.possible_root_causes);
  if (data.recommended_labs) formData.append('recommended_labs', data.recommended_labs);
  if (data.recommended_foods) formData.append('recommended_foods', data.recommended_foods);
  if (data.foods_to_avoid) formData.append('foods_to_avoid', data.foods_to_avoid);

  // Behavior image (single)
  if (data.image instanceof File) formData.append('image', data.image);

  // Protocol IDs
  if (data.suggested_protocol_ids?.length > 0) {
    data.suggested_protocol_ids.forEach((id: number) =>
      formData.append('suggested_protocol_ids', id.toString())
    );
  }

  // Supplement names (array of strings)
  if (data.supplements_name?.length > 0) {
    data.supplements_name.filter((n: string) => n?.trim()).forEach((n: string) =>
      formData.append('supplements_name', n)
    );
  } else {
    formData.append('supplements_name', '');
  }

  // Supplement images (array of files)
  if (data.supplements_images?.length > 0) {
    data.supplements_images.filter((f: any) => f instanceof File).forEach((file: File) =>
      formData.append('supplements_images', file, file.name)
    );
  }

  // Debug
  console.log('📦 FormData entries:');
  for (const [key, value] of formData.entries()) {
    console.log(`  ${key}:`, value);
  }

  return formData;
};

export const behaviorsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    getBehaviors: builder.query<BehaviorListResponse, { page: number }>({
      query: ({ page }) => `/behaviours/?page=${page}`,
      providesTags: ["Behaviors"],
      transformResponse: (res: BehaviorListResponse) => {
        console.log('✅ Behaviors list:', res);
        return res;
      },
    }),

    getBehaviorById: builder.query<Behavior, number>({
      query: (id) => `/behaviours/${id}/`,
      providesTags: (_result, _error, id) => [{ type: "Behaviors", id }],
      transformResponse: (res: Behavior) => {
        console.log('✅ Behavior detail:', res);
        return res;
      },
    }),

    createBehavior: builder.mutation<Behavior, any>({
      query: (data) => {
        console.log("🚀 Creating behavior:", data);
        return {
          url: "/behaviours/",
          method: "POST",
          body: buildFormData(data),
          formData: true,
        };
      },
      invalidatesTags: ["Behaviors"],
      transformResponse: (res: Behavior) => { console.log('✅ Created:', res); return res; },
      transformErrorResponse: (error: any) => { console.error('❌ Create error:', error); return error; },
    }),

    updateBehavior: builder.mutation<Behavior, { id: number; data: any }>({
      query: ({ id, data }) => {
        console.log("🔄 Updating behavior:", id, data);
        return {
          url: `/behaviours/${id}/`,
          method: "PATCH",
          body: buildFormData(data),
          formData: true,
        };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Behaviors", id }, "Behaviors"],
      transformResponse: (res: Behavior) => { console.log('✅ Updated:', res); return res; },
      transformErrorResponse: (error: any) => { console.error('❌ Update error:', error); return error; },
    }),

    deleteBehavior: builder.mutation<void, number>({
      query: (id) => ({ url: `/behaviours/${id}/`, method: "DELETE" }),
      invalidatesTags: ["Behaviors"],
    }),

  }),
  overrideExisting: true,
});

export const {
  useGetBehaviorsQuery,
  useGetBehaviorByIdQuery,
  useCreateBehaviorMutation,
  useUpdateBehaviorMutation,
  useDeleteBehaviorMutation,
} = behaviorsApi;