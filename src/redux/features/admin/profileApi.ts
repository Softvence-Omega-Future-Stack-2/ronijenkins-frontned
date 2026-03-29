import { baseAPI } from '../../api/baseApi';


// types for admin profile
interface AdminProfile {
  id: string;
  email: string;
  image: string;
  image_url: string;
  full_name: string;
  phone: string;
  address: string;
}

// interface UpdateAdminProfileRequest {
//   full_name?: string;
//   email?: string;
  
//   phone?: string;
//   address?: string;
//   image?: string; 
// }

export const profileApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET admin profile
    getAdminProfile: builder.query<AdminProfile, void>({
      query: () => '/admin/profile/',
      providesTags: ['AdminProfile'], 
    }),

      updateAdminProfile: builder.mutation<AdminProfile, FormData >({
      query: (data) => ({
        url: '/admin/profile/',
        method: 'PATCH',
        body: data,
         
      }),
      invalidatesTags: ['AdminProfile'], // auto refresh GET after update
    }),

        chnagePassword: builder.mutation({
      query: (data) => ({
        url: "/accounts/password-change/",
        method: "POST",
        body: data,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetAdminProfileQuery , useUpdateAdminProfileMutation, useChnagePasswordMutation } = profileApi;