import { baseAPI } from "../../api/baseApi";

interface PlatformSettings {
  new_user_registration: boolean;
  welcome_email: boolean;
}

interface UpdatePlatformSettingsRequest {
  new_user_registration?: boolean;
  welcome_email?: boolean;
}
export const platformSettingsApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    // GET platform settings
    getPlatformSettings: builder.query<PlatformSettings, void>({
      query: () => '/admin/platform-settings/',
      providesTags: ['PlatformSettings'],
    }),

    // PATCH update platform settings
updatePlatformSettings: builder.mutation<
  PlatformSettings,
  UpdatePlatformSettingsRequest
>({
  query: (data) => ({
    url: '/admin/platform-settings/',
    method: 'PATCH',
    body: data,
  }),
  invalidatesTags: ['PlatformSettings'],
}),

  }),
  overrideExisting: false,
});

export const {
  useGetPlatformSettingsQuery,
  useUpdatePlatformSettingsMutation,
} = platformSettingsApi;

