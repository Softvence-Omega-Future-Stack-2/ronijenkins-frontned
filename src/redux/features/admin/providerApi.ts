/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseAPI } from "../../api/baseApi";

// Types
interface OfficeHours {
  id: number;
  mon: string;
  tue: string;
  wed: string;
  thu: string;
  fri: string;
  sat: string;
  sun: string;
}

interface Provider {
  id: number;
  name: string;
  image: string;
  provider_category: string;
  designation: string;
  specializations: string;
  email: string;
  phone: string;
  website?: string;
  address: string;
  city?: string;
  status?: boolean;
  office_hours?: OfficeHours;
}

interface ProviderListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Provider[];
}

export const providerApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

 
    getProviders: builder.query<ProviderListResponse, { page?: number; search?: string }>({
      query: ({ page = 1, search = '' }) => {
        const params = new URLSearchParams();
        if (page) params.append('page', page.toString());
        if (search) params.append('search', search);
        return {
          url: `/providers/?${params.toString()}`,
          method: 'GET',
        };
      },
      providesTags: ['Providers'],
    }),

    
    getProviderById: builder.query<Provider, number>({
      query: (id) => ({
        url: `/providers/${id}/`,
        method: 'GET',
      }),
      providesTags: (_result, _error, id) => [{ type: 'Providers', id }],
    }),

  
    createProvider: builder.mutation<Provider, any>({
      query: (data) => {
        const hasImageFile = data.imageFile instanceof File;

        if (hasImageFile) {
          const formData = new FormData();
          formData.append('name', data.name);
          formData.append('provider_category', data.provider_category);
          formData.append('designation', data.designation);
          formData.append('specializations', data.specializations);
          formData.append('email', data.email);
          formData.append('phone', data.phone);
          formData.append('address', data.address);
          formData.append('office_hours', data.office_hours);
          if (data.website) formData.append('website', data.website);
          if (data.city) formData.append('city', data.city);
          if (data.imageFile) formData.append('image', data.imageFile);

          return { url: '/providers/', method: 'POST', body: formData };
        } else {
          const { ...jsonData } = data;
          return { url: '/providers/', method: 'POST', body: jsonData };
        }
      },
      invalidatesTags: ['Providers'],
    }),

  
    updateProvider: builder.mutation<Provider, { id: number; data: any }>({
      query: ({ id, data }) => {
        const hasImageFile = data.imageFile instanceof File;

        if (hasImageFile) {
          const formData = new FormData();
          if (data.name !== undefined) formData.append('name', data.name);
          if (data.provider_category !== undefined) formData.append('provider_category', data.provider_category);
          if (data.designation !== undefined) formData.append('designation', data.designation);
          if (data.specializations !== undefined) formData.append('specializations', data.specializations);
          if (data.email !== undefined) formData.append('email', data.email);
          if (data.phone !== undefined) formData.append('phone', data.phone);
          if (data.address !== undefined) formData.append('address', data.address);
          if (data.office_hours !== undefined) formData.append('office_hours', data.office_hours);
          if (data.website !== undefined) formData.append('website', data.website);
          if (data.city !== undefined) formData.append('city', data.city);
          if (data.imageFile) formData.append('image', data.imageFile);

          return { url: `/providers/${id}/`, method: 'PATCH', body: formData };
        } else {
          const { ...jsonData } = data;
          return { url: `/providers/${id}/`, method: 'PATCH', body: jsonData };
        }
      },
      invalidatesTags: (_result, _error, { id }) => ['Providers', { type: 'Providers', id }],
    }),

   
    deleteProvider: builder.mutation<void, number>({
      query: (id) => ({
        url: `/providers/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Providers'],
    }),

    
    updateProviderStatus: builder.mutation<{ status: boolean }, { id: number; status: boolean }>({
      query: ({ id, status }) => ({
        url: `/providers/status-update/${id}/`,
        method: 'PATCH',
        body: { status },
      }),
    
      invalidatesTags: (_result, _error, { id }) => [{ type: 'Providers', id }],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetProvidersQuery,
  useGetProviderByIdQuery,
  useCreateProviderMutation,
  useUpdateProviderMutation,
  useDeleteProviderMutation,
  useUpdateProviderStatusMutation,
} = providerApi;