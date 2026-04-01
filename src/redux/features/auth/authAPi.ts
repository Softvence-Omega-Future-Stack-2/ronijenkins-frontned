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


  }),
});

export const {
  useLoginMutation,

} = userAPI;