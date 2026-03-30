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

    refreshToken: build.mutation({
      query: (refreshToken: string) => ({
        url: "/token-refresh/",
        method: "POST",
        body: { refresh: refreshToken },
      }),
    }),

    verifyOTP: build.mutation({
      query: (data) => ({
        url: "/verify-email/",
        method: "POST",
        body: data,
      }),
    }),

    resendOTP: build.mutation({
      query: (data) => ({
        url: "/resend-otp/",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: build.mutation({
      query: (data) => ({
        url: "/password-forgot-confirm/",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: build.mutation({
      query: (data) => ({
        url: "/password-forgot-confirm/",
        method: "POST",
        body: data,
      }),
    }),

    EmailverifyOTP: build.mutation({
      query: (data) => ({
        url: "/password-forgot-request/",
        method: "POST",
        body: data,
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyOTPMutation,
  useEmailverifyOTPMutation,
} = userAPI;