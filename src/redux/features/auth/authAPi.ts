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

    verifyEmail: build.mutation({
      query: (data: { code: string; email: string }) => ({
        method: "POST",
        body: {
          query: `
            mutation verifyEmail($code: String!, $email: String!) {
              verifyEmail(code: $code, email: $email)
            }
          `,
          variables: {
            code: data.code,
            email: data.email,
          },
        },
      }),
      // Postman-e "data: true" ashche tai transformResponse add kora holo
      transformResponse: (response: any) => response?.data?.verifyEmail,
    }),

resetPassword: build.mutation({
  query: (data) => ({
    method: "POST",
    body: {
      query: `
        mutation resetPassword($input: ResetPasswordInput!) {
          resetPassword(input: $input)
        }
      `,
      variables: {
        input: {
          email: data.email,
          code: data.code,
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
  useForgetPasswordMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useChangePasswordMutation
} = userAPI;