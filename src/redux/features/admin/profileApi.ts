import { baseAPI } from "../../api/baseApi";

export interface AdminInfo {
  id?: string;
  fullName?: string;
  address?: string;
  intro?: string;
  city?: string;
  state?: string;
  zip?: string;
  location?: string;
}

export interface AdminData {
  id: string;
  username: string;
  email: string;
  contactNo: string;
  avatar?: string;
  role: string;
  status: string;
  lang?: string;
  admin?: AdminInfo;
}

export interface UpdateAdminInput {
  userId?: string;
  username?: string;
  contactNo?: string;
  lang?: string;
  avatar?: string;
  admin?: AdminInfo;
}

export const adminAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({

    getAdminProfile: build.query<AdminData, void>({
      query: () => ({
        url: "",
        method: "POST",
        body: {
          query: `
            query {
              getMe {
                id
                email
                username
                contactNo
                avatar
                role
                status
                lang
                admin {
                  id
                  fullName
                  address
                  intro
                  city
                  state
                  zip
                  location
                }
              }
            }
          `,
        },
      }),
      transformResponse: (response: any) =>
        response?.data?.getMe ?? response?.data ?? response,
      providesTags: ["AdminProfile"],
    }),

    updateAdminProfile: build.mutation<AdminData, { input: UpdateAdminInput; avatarFile?: File }>({
      query: ({ input, avatarFile }) => {
        // If avatar file provided → multipart/form-data (GraphQL multipart upload spec)
        if (avatarFile) {
          const operations = JSON.stringify({
            query: `
              mutation UpdateAdmin($avatar: Upload!, $updateAdminUserInput: UpdateAdminUserInput!) {
                updateAdmin(avatar: $avatar, updateAdminUserInput: $updateAdminUserInput) {
                  id email username avatar contactNo lang
                  admin { id fullName address intro city state zip location }
                }
              }
            `,
            variables: {
              avatar: null,
              updateAdminUserInput: input,
            },
          });

          const map = JSON.stringify({ "0": ["variables.avatar"] });
          const formData = new FormData();
          formData.append("operations", operations);
          formData.append("map", map);
          formData.append("0", avatarFile);

          return {
            url: "",
            method: "POST",
            body: formData,
            // Don't set Content-Type — browser sets multipart boundary automatically
            headers: { "Content-Type": undefined as any },
          };
        }

        // No avatar file → regular JSON
        return {
          url: "",
          method: "POST",
          body: {
            query: `
              mutation UpdateAdmin($updateAdminUserInput: UpdateAdminUserInput!) {
                updateAdmin(updateAdminUserInput: $updateAdminUserInput) {
                  id email username avatar contactNo lang
                  admin { id fullName address intro city state zip location }
                }
              }
            `,
            variables: { updateAdminUserInput: input },
          },
        };
      },
      transformResponse: (response: any) =>
        response?.data?.updateAdmin ?? response?.data,
      invalidatesTags: ["AdminProfile"],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetAdminProfileQuery,
  useUpdateAdminProfileMutation,
} = adminAPI;