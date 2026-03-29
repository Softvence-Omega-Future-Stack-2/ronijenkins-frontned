import { baseAPI } from "../../api/baseApi";


export const recentActivityApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({

    getRecentActivities: builder.query({
      query: ({ ordering, search }) => ({
        url: "/recent-activity/",
        method: "GET",
        params: {
          ordering,
          search,
        },
      }),
      providesTags: ["RecentActivity"],
    }),

  }),
});

export const { useGetRecentActivitiesQuery } = recentActivityApi;