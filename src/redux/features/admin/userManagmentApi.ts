/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseAPI } from "../../api/baseApi";

export const userAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getAllUsers: build.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            query getAll($input: GetAllGenericArgs) {
              getAll(input: $input) {
                id
                username
                email
                role
                status
                avatar
                contactNo
                createdAt
                lang
              }
            }
          `,
          variables: {
            input: {
              pagination: {
                limit: params?.limit ?? 5,
                page: params?.page ?? 1,
              },
            },
          },
        },
      }),
      // ✅ transformResponse আপাতত একদম সিম্পল রাখুন
      transformResponse: (response: any) => response, 
      providesTags: ["Users"],
    }),


    // userApi.ts
getUser: build.query({
  query: (id: string) => ({
    url: "", // আপনার GraphQL endpoint
    method: "POST",
    body: {
      query: `
        query getUser($id: String!) {
          getUser(id: $id) {
            id
            username
            email
            role
            status
            avatar
            contactNo
            createdAt
            lang
          }
        }
      `,
      variables: { id },
    },
  }),
  providesTags: (result, error, id) => [{ type: "Users", id }],
}),
   
// userApi.ts
changeUserStatus: build.mutation({
  query: (statusInput) => ({
    url: "", // আপনার GraphQL বা REST endpoint
    method: "POST",
    body: {
      query: `
        mutation changeUserStatus($input: ChangeUserStatusInput!) {
          changeUserStatus(input: $input) {
            id
            status
          }
        }
      `,
      variables: { input: statusInput },
    },
  }),
  invalidatesTags: ["Users"],
}),
  }),
});

export const { useGetAllUsersQuery, useChangeUserStatusMutation, useGetUserQuery } = userAPI;