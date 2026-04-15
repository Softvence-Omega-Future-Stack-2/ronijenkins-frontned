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

forgetPassword: build.mutation({
      query: (email: string) => ({
        method: "POST",
        body: {
          query: `
            mutation forgetPassword($email: String!) {
              forgetPassword(email: $email)
            }
          `,
          variables: { email },
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
  useForgetPasswordMutation,
  useChangePasswordMutation
} = userAPI;