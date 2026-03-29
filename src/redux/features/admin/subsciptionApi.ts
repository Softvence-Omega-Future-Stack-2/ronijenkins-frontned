



import { baseAPI } from "../../api/baseApi";

export interface Subscription {
  plan_name: string;
  price: number;
  stripe_price_id: string | null;
  status: boolean;
}

export interface UpdateSubscriptionPricePayload {
  plan_name: string;
  price_id: string;
  price: number;
}

export interface MessageResponse {
  message: string;
}



export const subscriptionApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({


    getSubscriptions: builder.query<Subscription[], void>({
      query: () => ({
        url: "/subscriptions/list/",
        method: "GET",
      }),
      providesTags: ["Subscription"],
    }),


    updateSubscriptionPrice: builder.mutation<
      MessageResponse,
      UpdateSubscriptionPricePayload
    >({
      query: ({ plan_name, price_id, price }) => ({
        url: `/subscriptions/update-price/${plan_name}/`,
        method: "PUT",
        body: { price_id, price },
      }),
      invalidatesTags: ["Subscription"],
    }),


    toggleFreeTier: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: "/subscriptions/toggle-free-tier/",
        method: "PUT",
      }),
      invalidatesTags: ["Subscription"],
    }),

  }),
});



export const {
  useGetSubscriptionsQuery,
  useUpdateSubscriptionPriceMutation,
  useToggleFreeTierMutation,
} = subscriptionApi;





