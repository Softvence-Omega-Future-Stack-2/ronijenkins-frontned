/* eslint-disable @typescript-eslint/no-explicit-any */

import { baseAPI } from "../../../api/baseApi";


export type ProtocolCategory =
  | "behavioral"
  | "detoxification"
  | "gut_health"
  | "immune_support";

export interface Protocol {
  id: number;
  protocol_name: string;
  category: ProtocolCategory;
  image?: string;
  description: string;
  root_causes_count: number;
  supplements_count: number;
  symptoms_addressed: string;
  healing_approach: string;
  recommended_labs: string;
  key_supplements: string;
  recommended_foods: string;
  foods_to_avoid: string;
  created_at: string;
  updated_at: string;
}

export interface ProtocolListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Protocol[];
}

export interface ProtocolName {
  id: number;
  protocol_name: string;
}

export interface ProtocolNameListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProtocolName[];
}

// --------------------- API Slice ---------------------
export const protocolApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({


    getProtocols: builder.query<
      ProtocolListResponse,
      { page?: number; page_size?: number; search?: string; category?: ProtocolCategory; ordering?: string }
    >({
      query: ({ page = 1, page_size = 10, search, category, ordering }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", String(page));
        if (page_size) params.append("page_size", String(page_size));
        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (ordering) params.append("ordering", ordering);

        return { url: `/protocols/?${params.toString()}`, method: "GET" };
      },
      providesTags: ["Protocols"],
      transformResponse: (response: ProtocolListResponse) => {
        console.log("✅ Protocols list:", response);
        return response;
      },
    }),

    // GET /protocols/{id}/ - Get single protocol details
    getProtocolById: builder.query<Protocol, number>({
      query: (id) => ({ url: `/protocols/${id}/`, method: "GET" }),
      providesTags: (_result, _error, id) => [{ type: "Protocols", id }],
      transformResponse: (response: Protocol) => {
        console.log("✅ Protocol details:", response);
        return response;
      },
    }),

    // POST /protocols/ - Create protocol
    createProtocol: builder.mutation<Protocol, any>({
      query: (data) => {
        console.log("🚀 Creating protocol:", data);
        
        // Check if there's an image file
        const hasImageFile = data.imageFile instanceof File;
        
        if (hasImageFile) {
          // Use FormData for file upload
          const formData = new FormData();
          
          formData.append('protocol_name', data.protocol_name);
          formData.append('category', data.category);
          formData.append('description', data.description);
          formData.append('root_causes_count', String(data.root_causes_count || 0));
          formData.append('supplements_count', String(data.supplements_count || 0));
          
          // Send "N/A" for empty required fields (Backend doesn't accept blank)
          formData.append('symptoms_addressed', data.symptoms_addressed || 'N/A');
          formData.append('healing_approach', data.healing_approach || 'N/A');
          formData.append('recommended_labs', data.recommended_labs || 'N/A');
          formData.append('key_supplements', data.key_supplements || 'N/A');
          formData.append('recommended_foods', data.recommended_foods || 'N/A');
          formData.append('foods_to_avoid', data.foods_to_avoid || 'N/A');
          
          if (data.imageFile) formData.append('image', data.imageFile);
          
          console.log('📤 Sending FormData with image');
          
          return {
            url: '/protocols/',
            method: 'POST',
            body: formData,
          };
        } else {
          // Regular JSON (no image)
          const {  ...jsonData } = data;
          
          return {
            url: '/protocols/',
            method: 'POST',
            body: jsonData,
          };
        }
      },
      invalidatesTags: ["Protocols"],
      transformResponse: (response: Protocol) => response,
      transformErrorResponse: (error: any) => {
        console.error("❌ Create protocol error:", error);
        return error;
      },
    }),

    // PATCH /protocols/{id}/ - Update protocol
    updateProtocol: builder.mutation<Protocol, { id: number; data: any }>({
      query: ({ id, data }) => {
        console.log('🚀 Updating protocol:', id, data);
        
        const hasImageFile = data.imageFile instanceof File;
        
        if (hasImageFile) {
          // Use FormData for file upload
          const formData = new FormData();
          
          if (data.protocol_name !== undefined) formData.append('protocol_name', data.protocol_name);
          if (data.category !== undefined) formData.append('category', data.category);
          if (data.description !== undefined) formData.append('description', data.description);
          if (data.root_causes_count !== undefined) formData.append('root_causes_count', String(data.root_causes_count));
          if (data.supplements_count !== undefined) formData.append('supplements_count', String(data.supplements_count));
          
          // Only append detail fields if they exist and are not empty
          if (data.symptoms_addressed) formData.append('symptoms_addressed', String(data.symptoms_addressed));
          if (data.healing_approach) formData.append('healing_approach', String(data.healing_approach));
          if (data.recommended_labs) formData.append('recommended_labs', String(data.recommended_labs));
          if (data.key_supplements) formData.append('key_supplements', String(data.key_supplements));
          if (data.recommended_foods) formData.append('recommended_foods', String(data.recommended_foods));
          if (data.foods_to_avoid) formData.append('foods_to_avoid', String(data.foods_to_avoid));
          
          if (data.imageFile) formData.append('image', data.imageFile);
          
          return {
            url: `/protocols/${id}/`,
            method: 'PATCH',
            body: formData,
          };
        } else {
          // Regular JSON
          const {  ...jsonData } = data;
          
          return {
            url: `/protocols/${id}/`,
            method: 'PATCH',
            body: jsonData,
          };
        }
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Protocols", id }, "Protocols"],
      transformResponse: (response: Protocol) => {
        console.log("✅ Protocol updated:", response);
        return response;
      },
    }),

    // DELETE /protocols/{id}/ - Delete protocol
    deleteProtocol: builder.mutation<void, number>({
      query: (id) => ({ 
        url: `/protocols/${id}/`,
         method: "DELETE"
         }),
      invalidatesTags: ["Protocols"],
      transformResponse: () => {
        console.log("✅ Protocol deleted");
      },
    }),

    // GET /protocols/name-list/ - Only id & protocol_name
    getProtocolNameList: builder.query<
      ProtocolNameListResponse,
      { page?: number; page_size?: number; search?: string; ordering?: string }
    >({
      query: ({ page = 1, page_size = 50, search, ordering }) => {
        const params = new URLSearchParams();
        if (page) params.append("page", String(page));
        if (page_size) params.append("page_size", String(page_size));
        if (search) params.append("search", search);
        if (ordering) params.append("ordering", ordering);

        return { url: `/protocols/name-list/?${params.toString()}`, method: "GET" };
      },
      providesTags: ["Protocols"],
      transformResponse: (response: ProtocolNameListResponse) => {
        console.log("✅ Protocol name list:", response);
        return response;
      },
    }),

  }),
  overrideExisting: false,
});

// --------------------- Export Hooks ---------------------
export const {
  useGetProtocolsQuery,
  useGetProtocolByIdQuery,
  useCreateProtocolMutation,
  useUpdateProtocolMutation,
  useDeleteProtocolMutation,
  useGetProtocolNameListQuery,
} = protocolApi;





// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// // --------------------- Types ---------------------
// export type ProtocolCategory =
//   | "behavioral"
//   | "detoxification"
//   | "gut_health"
//   | "immune_support";

// export interface Protocol {
//   id: number;
//   protocol_name: string;
//   category: ProtocolCategory;
//   image: string;
//   description: string;
//   root_causes_count: number;
//   supplements_count: number;
//   symptoms_addressed: string;
//   healing_approach: string;
//   recommended_labs: string;
//   key_supplements: string;
//   recommended_foods: string;
//   foods_to_avoid: string;
//   created_at: string;
//   updated_at: string;
// }

// export interface ProtocolListResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Protocol[];
// }

// export interface ProtocolName {
//   id: number;
//   protocol_name: string;
// }

// export interface ProtocolNameListResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: ProtocolName[];
// }

// // --------------------- API Slice ---------------------
// export const protocolApi = createApi({
//   reducerPath: "protocolApi",
//   baseQuery: fetchBaseQuery({ baseUrl: "/api" }), // change to your base URL
//   tagTypes: ["Protocols"],
//   endpoints: (builder) => ({

//     // 1️⃣ GET /protocols/
//     getProtocols: builder.query<
//       ProtocolListResponse,
//       { page?: number; page_size?: number; search?: string; category?: ProtocolCategory; ordering?: string }
//     >({
//       query: ({ page = 1, page_size = 10, search, category, ordering }) => {
//         const params = new URLSearchParams();
//         if (page) params.append("page", String(page));
//         if (page_size) params.append("page_size", String(page_size));
//         if (search) params.append("search", search);
//         if (category) params.append("category", category);
//         if (ordering) params.append("ordering", ordering);

//         return `/protocols/?${params.toString()}`;
//       },
//       providesTags: ["Protocols"],
//     }),

//     // 2️⃣ GET /protocols/{id}/
//     getProtocolById: builder.query<Protocol, number>({
//       query: (id) => `/protocols/${id}/`,
//       providesTags: (result, error, id) => [{ type: "Protocols", id }],
//     }),

//     // 3️⃣ POST /protocols/
//     createProtocol: builder.mutation<Protocol, Partial<Protocol>>({
//       query: (data) => ({
//         url: "/protocols/",
//         method: "POST",
//         body: data,
//       }),
//       invalidatesTags: ["Protocols"],
//     }),

//     // 4️⃣ PATCH /protocols/{id}/
//     updateProtocol: builder.mutation<Protocol, { id: number; data: Partial<Protocol> }>({
//       query: ({ id, data }) => ({
//         url: `/protocols/${id}/`,
//         method: "PATCH",
//         body: data,
//       }),
//       invalidatesTags: (result, error, { id }) => [{ type: "Protocols", id }],
//     }),

//     // 5️⃣ DELETE /protocols/{id}/
//     deleteProtocol: builder.mutation<void, number>({
//       query: (id) => ({
//         url: `/protocols/${id}/`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Protocols"],
//     }),

//     // 6️⃣ GET /protocols/name-list/
//     getProtocolNameList: builder.query<
//       ProtocolNameListResponse,
//       { page?: number; page_size?: number; search?: string; ordering?: string }
//     >({
//       query: ({ page = 1, page_size = 50, search, ordering }) => {
//         const params = new URLSearchParams();
//         if (page) params.append("page", String(page));
//         if (page_size) params.append("page_size", String(page_size));
//         if (search) params.append("search", search);
//         if (ordering) params.append("ordering", ordering);

//         return `/protocols/name-list/?${params.toString()}`;
//       },
//       providesTags: ["Protocols"],
//     }),

//   }),
// });

// // --------------------- Export Hooks ---------------------
// export const {
//   useGetProtocolsQuery,
//   useGetProtocolByIdQuery,
//   useCreateProtocolMutation,
//   useUpdateProtocolMutation,
//   useDeleteProtocolMutation,
//   useGetProtocolNameListQuery,
// } = protocolApi;
