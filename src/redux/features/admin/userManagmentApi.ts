import { baseAPI } from "../../api/baseApi";

export const customerApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
   

getCustomers: build.query({
  query: ({ page = 1, limit = 10 }) => ({
    method: "POST",
    body: {
      query: `
        query customers($input: GetAllGenericArgs) {
          customers(input: $input) {
            id
            email
            username
            role
            status
            createdAt
            customer {
              fullName
              address
            }
          }
        }
      `,
      variables: {
        input: {
          pagination: {
            limit: limit,
            page: page,
          },
        },
      },
    },
  }),
 
  transformResponse: (response: any) => {
   
    if (response && response.data) {
       return response.data; 
    }
 
    return response?.data?.customers?.data || response?.data?.customers || [];
  },
  providesTags: ["Customers"],
}),

 
    getHealthGoalsByCustomerId: build.query({
      query: (customerId: string) => ({
        method: "POST",
        body: {
          query: `
            query getHealthGoalsByCustomerId($customerId: String!) {
              getHealthGoalsByCustomerId(customerId: $customerId) {
                category
                createdAt
                currentValue
                customerId
                endDate
                id
                name
                notes
                startDate
                targetValue
                updatedAt
                whatMeasuring
              }
            }
          `,
          variables: { customerId },
        },
      }),
      transformResponse: (response: any) => response.data.getHealthGoalsByCustomerId,
      providesTags: ["HealthGoals"],
    }),

    getMedicalHistoriesByCustomerId: build.query({
      query: (customerId: string) => ({
        method: "POST",
        body: {
          query: `
            query getMedicalHistoriesByCustomerId($customerId: String!) {
              getMedicalHistoriesByCustomerId(customerId: $customerId) {
                id
                name
                notes
                createdAt
              }
            }
          `,
          variables: { customerId },
        },
      }),
      transformResponse: (response: any) => response?.data?.getMedicalHistoriesByCustomerId,
      providesTags: ["MedicalHistory"],
    }),

    getSymptomsByCustomerId: build.query({
      query: (customerId: string) => ({
        method: "POST",
        body: {
          query: `
            query getSymptomsByCustomerId($customerId: String!) {
              getSymptomsByCustomerId(customerId: $customerId) {
                id
                name
                severity
                createdAt
              }
            }
          `,
          variables: { customerId },
        },
      }),
      transformResponse: (response: any) => response?.data?.getSymptomsByCustomerId,
      providesTags: ["Symptoms"],
    }),

    changeUserStatus: build.mutation({
  query: (statusInput) => ({
    url: "", 
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
  invalidatesTags: ["Customers"],
}),
  
  }),
});

export const { 
  useGetCustomersQuery, 
  useGetHealthGoalsByCustomerIdQuery ,
  useGetMedicalHistoriesByCustomerIdQuery,
  useGetSymptomsByCustomerIdQuery,
  useChangeUserStatusMutation
} = customerApi;







/* eslint-disable @typescript-eslint/no-explicit-any */
// import { baseAPI } from "../../api/baseApi";

// export const userAPI = baseAPI.injectEndpoints({
//   endpoints: (build) => ({
//     getAllUsers: build.query({
//       query: (params?: { page?: number; limit?: number }) => ({
//         url: "",
//         method: "POST",
//         body: {
//           query: `
//             query getAll($input: GetAllGenericArgs) {
//               getAll(input: $input) {
//                 id
//                 username
//                 email
//                 role
//                 status
//                 avatar
//                 contactNo
//                 createdAt
//                 lang
//               }
//             }
//           `,
//           variables: {
//             input: {
//               pagination: {
//                 limit: params?.limit ?? 5,
//                 page: params?.page ?? 1,
//               },
//             },
//           },
//         },
//       }),
//       // ✅ transformResponse আপাতত একদম সিম্পল রাখুন
//       transformResponse: (response: any) => response, 
//       providesTags: ["Users"],
//     }),


//     // userApi.ts
// getUser: build.query({
//   query: (id: string) => ({
//     url: "", // আপনার GraphQL endpoint
//     method: "POST",
//     body: {
//       query: `
//         query getUser($id: String!) {
//           getUser(id: $id) {
//             id
//             username
//             email
//             role
//             status
//             avatar
//             contactNo
//             createdAt
//             lang
//           }
//         }
//       `,
//       variables: { id },
//     },
//   }),
//   providesTags: ( id) => [{ type: "Users", id }],
// }),
   
// // userApi.ts
// changeUserStatus: build.mutation({
//   query: (statusInput) => ({
//     url: "", // আপনার GraphQL বা REST endpoint
//     method: "POST",
//     body: {
//       query: `
//         mutation changeUserStatus($input: ChangeUserStatusInput!) {
//           changeUserStatus(input: $input) {
//             id
//             status
//           }
//         }
//       `,
//       variables: { input: statusInput },
//     },
//   }),
//   invalidatesTags: ["Users"],
// }),
//   }),
// });

// export const { useGetAllUsersQuery, useChangeUserStatusMutation, useGetUserQuery } = userAPI;