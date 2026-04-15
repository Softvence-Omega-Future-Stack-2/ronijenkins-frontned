/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseAPI } from "../../api/baseApi";

export const subscriptionAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({


   getPayments: build.query({
  query: ({ page = 1, limit = 10 }) => ({
    method: "POST",
    body: {
      query: `
        query payments($input: GetAllGenericArgs) {
          payments(input: $input) {
            amount
            createdAt
            currency
            customerId
            id
            paymentDate
            paymentStatus
            subscriptionId
            subscriptionPlanId
            updatedAt
          }
        }
      `,
      variables: {
        input: {
          pagination: {
            limit,
            page,
          },
        },
      },
    },
  }),

transformResponse: (response: any) => {
  console.log("FULL RESPONSE 👉", response);

  return {
    payments: response?.data || [], 
    meta: response?.meta || {},
  };
},

  providesTags: ["Payments"],
}),

   getSubscriptionPlans: build.query({
      query: (params?: { page?: number; limit?: number }) => ({
        url: "",
        method: "POST",
        body: {
          // ⚠️ আপনার পোস্টম্যান ইমেজ অনুযায়ী টাইপ চেক করুন
          query: `
            query SubscriptionPlans($input: GetAllGenericArgs!) {
              SubscriptionPlans(input: $input) {
                id
                name
                description
                features
                price
                plan
                status
                createdAt
                updatedAt
              }
            }
          `,
          variables: {
            input: {
              pagination: {
                limit: params?.limit ?? 10,
                page: params?.page ?? 1,
              },
            },
          },
        },
      }),
  
      transformResponse: (response: any) => response, 
      providesTags: ["Subscription"],
    }),

createSubscriptionPlan: build.mutation({
  query: (data) => ({
    url: "",
    method: "POST",
    body: {
      query: `
        mutation createSubscriptionPlan($input: CreateSubscriptionPlanInput!) {
          createSubscriptionPlan(input: $input) {
            id name plan price status description
            features stripePriceId trialPeriod createdAt updatedAt
          }
        }
      `,
      variables: {
        input: {
          name: data.name,
          description: data.description,
          features: data.features,
          plan: data.plan,          
          price: Number(data.price),
          status: data.status,
          trialPeriod: data.trialPeriod,
          stripePriceId: data.stripePriceId,
        },
      },
    },
  }),
  invalidatesTags: ["Subscription"],
}),

updateSubscriptionPlan: build.mutation({
  query: ({ id, ...data }) => ({
    url: "",
    method: "POST",
    body: {
      query: `
        mutation updateSubscriptionPlan($id: String!, $input: UpdateSubscriptionPlanInput!) {
          updateSubscriptionPlan(id: $id, input: $input) {
            id
            name
            description
            features
            plan
            price
            status
            stripePriceId
            trialPeriod
          }
        }
      `,
      variables: {
        id,
        input: {
          name: data.name,
          description: data.description,
          features: data.features,
          plan: data.plan, // 'MONTHLY', 'YEARLY', বা 'FREE'
          price: Number(data.price),
          status: data.status,
          stripePriceId: data.stripePriceId,
          trialPeriod: data.trialPeriod,
        },
      },
    },
  }),
  invalidatesTags: ["Subscription"],
}),

removeSubscriptionPlan: build.mutation({
      query: (id: string) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation removeSubscriptionPlan ($id: String!) {
              removeSubscriptionPlan (id: $id) 
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: ["Subscription"],
    }),
    updateSubscriptionStatus: build.mutation({
      query: ({ id, status }) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation updateSubscriptionPlanStatus ($id: String!, $status: SubscriptionPlanStatus!) {
              updateSubscriptionPlanStatus (id: $id, status: $status) { id status }
            }
          `,
          variables: { id, status },
        },
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const { 
  useGetPaymentsQuery,
  useGetSubscriptionPlansQuery, 
  useCreateSubscriptionPlanMutation, 
  useUpdateSubscriptionPlanMutation,
  useRemoveSubscriptionPlanMutation,
  useUpdateSubscriptionStatusMutation
} = subscriptionAPI;