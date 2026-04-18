import { baseAPI } from "../../api/baseApi";

export const notificationApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    getNotifications: build.query({
      query: ({ page = 1, limit = 10 }) => ({
        method: "POST",
        body: JSON.stringify({
          query: `
            query getNotifications($input: GetAllGenericArgs) {
              getNotifications(input: $input) {
                body
                createdAt
                data
                id
                read
                title
                type
                updatedAt
                userId
              }
            }
          `,
          variables: {
            input: {
              pagination: {
                page,
                limit,
              },
              searchTerm: "",
              sortBy: {
                field: "createdAt",
                order: "desc",
              },
            },
          },
        }),
      }),

transformResponse: (res: any) => {
  console.log("RAW API RESPONSE:", res);

  return {
    notifications: res?.data || [], 
    meta: res?.meta || {
      page: 1,
      limit: 10,
      total: 0,
      totalPage: 1,
    },
  };
},

      providesTags: ["Notifications"],
    }),

    markAllNotificationsAsRead: build.mutation<void, void>({
      query: () => ({
        method: "POST",
        body: JSON.stringify({
          query: `
            mutation {
              markAllNotificationsAsRead
            }
          `,
        }),
      }),
      invalidatesTags: ["Notifications"],
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
} = notificationApi;   






// import { baseAPI } from "../../api/baseApi";

// export const notificationApi = baseAPI.injectEndpoints({
//   endpoints: (build) => ({
//    // notificationApi.ts
// getNotifications: build.query({
//   query: ({ page = 1, limit = 10 }) => ({
//     method: "POST",
//     body: JSON.stringify({
//       query: `
//         query getNotifications($input: GetAllGenericArgs) {
//           getNotifications(input: $input) {
//             meta {
//               page
//               limit
//               total
//               totalPage
//             }
//             data {
//               id
//               userId
//               type
//               title
//               body
//               data
//               read
//               createdAt
//               updatedAt
//             }
//           }
//         }
//       `,
//       variables: {
//         input: {
//           pagination: {
//             page,
//             limit,
//           },
//           searchTerm: "",
//           sortBy: {
//             field: "createdAt",
//             order: "desc",
//           },
//         },
//       },
//     }),
//   }),

//   transformResponse: (res: any) => ({
//     notifications: res?.data?.getNotifications?.data || [],
//     meta: res?.data?.getNotifications?.meta || {},
//   }),

//   providesTags: ["Notifications"],
// }),

//     markAllNotificationsAsRead: build.mutation<void, void>({
//       query: () => ({
//         method: "POST",
//         body: JSON.stringify({
//           query: `
//             mutation {
//               markAllNotificationsAsRead
//             }
//           `,
//         }),
//       }),
//       invalidatesTags: ["Notifications"],
//     }),
//   }),
// });

// export const {
//   useGetNotificationsQuery,
//   useMarkAllNotificationsAsReadMutation,
// } = notificationApi;