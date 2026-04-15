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
                meta {
                  page
                  limit
                  total
                  totalPage
                }
                data {
                  id
                  title
                  body
                  read
                  type
                  createdAt
                  updatedAt
                  userId
                }
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

      transformResponse: (res: any) => ({
        notifications: res?.data?.getNotifications?.data || [],
        meta: res?.data?.getNotifications?.meta || {},
      }),

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