import { baseAPI } from "../../api/baseApi";

interface AnalyticsOverviewResponse {
  user: {
    total_user: number;
    premium_user: number;
    free_user: number;
  };
  total_journal: number;
  total_behaviour_search: number;
  last_month_revenue: number;
}

interface UserGrowthItem {
  date: string;
  count: number;
}

export interface RevenueGrowthItem {
  date: string;
  amount: number;
 
}

interface FeatureUsageItem {
  feature: string;  
  count: number;
  percentage: number;
}

interface FeatureUsageResponse {
  features: FeatureUsageItem[];
}

interface SubscriptionType {
  count: number;
  percentage: number;
}

interface SubscriptionBreakdownResponse {
  premium: SubscriptionType;
  free: SubscriptionType;
}

export interface TopSupplementResponse {
  top_supplement: string[];
}

export const analyticsApi = baseAPI.injectEndpoints({
    endpoints: (builder) => ({
        getOverviewCard: builder.query<AnalyticsOverviewResponse, void>({
            query:()=> ({
                url: "/analytics/overview/",
                method: "GET"
            }),
            providesTags: ['Analytics']
        }),

        getUserGrouth: builder.query<UserGrowthItem[], void>({
            query:()=> ({
                url: "/analytics/user-growth/",
                method: "GET"
            })
        }),

        getRevenueGrowth: builder.query<RevenueGrowthItem[], void>({
  query: () => ({
    url: "/analytics/revenue-growth/",
    method: "GET",
  }),
  providesTags: ["Analytics"],
}),

         getFeatureUsage: builder.query<FeatureUsageResponse, void>({
      query: () => ({
        url: "/feature-usage/feature-usage/",
        method: "GET",
      })

    }),

    getSubscriptionBreakdown: builder.query<SubscriptionBreakdownResponse, void>({
  query: () => ({
    url: "/analytics/subscription-breakdown/",
    method: "GET",
  }),
  providesTags: ["Analytics"],
}),

getTopSupplement: builder.query<TopSupplementResponse, void>({
  query: () => ({
    url: "/analytics/top-supplement/",
    method: "GET",
  }),
  providesTags: ["Analytics"],
}),

})

})


export const {useGetOverviewCardQuery, useLazyGetUserGrouthQuery,   useGetRevenueGrowthQuery,  useLazyGetFeatureUsageQuery ,   useGetFeatureUsageQuery,  useGetSubscriptionBreakdownQuery , useGetTopSupplementQuery  } = analyticsApi;