import { baseAPI } from "../../api/baseApi";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({

    login: build.mutation({
  query: (data: { email: string; password: string }) => ({
    url: "",
    method: "POST",
    body: {
      query: `
        mutation login($input: LoginInput!) {
          login(input: $input) {
            accessToken
            refreshToken
          }
        }
      `,
      variables: {
        input: {
          email: data.email,
          password: data.password,
        },
      },
    },
  }),
}),


changePassword: build.mutation({
      query: ({ newPass, oldPass }) => ({
        method: "POST",
        body: {
          query: `
            mutation changePassword($newPass: String!, $oldPass: String!) {
              changePassword(newPass: $newPass, oldPass: $oldPass)
            }
          `,
          variables: { newPass, oldPass },
        },
      }),
    }),
  })
});

export const {
  useLoginMutation,
  useChangePasswordMutation
} = userAPI;