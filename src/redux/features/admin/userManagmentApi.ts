import { baseAPI } from "../../api/baseApi";

export interface UserSubscription {
  name: string;
  expire_date: string;
}

export interface UserFeatureUsages {
  behaviours_usage: number;
  supplements_usage: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  image: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  subscription: UserSubscription | null;
  feature_usages: UserFeatureUsages;
}

export interface UserListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export interface GetUsersParams {
  page?: number;
  page_size?: number;
  search?: string;
  plan?: 'free' | 'premium' | '';
  ordering?: string;
}

export const userManagementApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<UserListResponse, GetUsersParams>({
      query: ({ page = 1, page_size = 10, search = '', plan = '', ordering = '' }) => {
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('page_size', String(page_size));
        if (search) params.append('search', search);
        if (plan) params.append('plan', plan);
        if (ordering) params.append('ordering', ordering);
        return { url: `/admin/users/?${params.toString()}`, method: 'GET' };
      },
      providesTags: ['Users'],
    }),

    activateUser: builder.mutation<void, string>({
  query: (id) => ({
    url: `/admin/users/${id}/activate/`,
    method: 'PATCH',
  }),
  invalidatesTags: ['Users'],
}),

deactivateUser: builder.mutation<void, string>({
  query: (id) => ({
    url: `/admin/users/${id}/deactivate/`,
    method: 'PATCH',
  }),
  invalidatesTags: ['Users'],
}),

deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/admin/users/${id}/delete/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

  }),
  overrideExisting: true,
});

export const { useGetUsersQuery , useActivateUserMutation, useDeactivateUserMutation, useDeleteUserMutation } = userManagementApi;