import { baseAPI } from "../../api/baseApi";


export const dashboardApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // সিস্টেম ওভারভিউ ডাটা গেট করার কুয়েরি 
    getSystemOverview: build.query({
      query: () => ({
        url: "", 
    method: "POST",
        body: {
          query: `
            query getSystemOverview {
              getSystemOverview {
                users {
                  total
                  admins
                  customers
                  active
                  inactive
                }
                revenue {
                  totalRevenue
                  byCurrency {
                    currency
                    amount
                  }
                  activeSubscriptions
                  totalPayments
                }
                engagement {
                  totalContent
                  totalImpressions
                  avgContentRating
                  totalPosts
                  totalComments
                }
                health {
                  totalLogs
                  topSymptoms {
                    name
                    count
                    avgSeverity
                  }
                  overallAvgSeverity
                }
              }
            }
          `,
        },
      }),
      
      transformResponse: (response: any) => {
  console.log("📥 Overview raw:", response);
  // server returns { data: { getSystemOverview: {...} } } OR { data: {...} }
  return response?.data?.getSystemOverview ?? response?.data ?? response;
},
      providesTags: ["Overview"],
    }),
  }),
});

export const { useGetSystemOverviewQuery } = dashboardApi;