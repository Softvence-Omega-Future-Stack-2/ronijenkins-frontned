import { baseAPI } from "../../api/baseApi";


// Backend Enums (Erasable Syntax Safe)
export const BroadcastType = {
  NOW: 'NOW',
  SCHEDULED: 'SCHEDULED',
} as const;

export type BroadcastType = (typeof BroadcastType)[keyof typeof BroadcastType];

export const BroadcastMethod = {
  FCM: 'FCM',
  EMAIL: 'EMAIL',
  SMS: 'SMS',
} as const;

export type BroadcastMethod = (typeof BroadcastMethod)[keyof typeof BroadcastMethod];

export const broadcastApi = baseAPI.injectEndpoints({
  endpoints: (build) => ({
    // Create Broadcast Mutation
    createBroadcast: build.mutation({
      query: ({ file, input }) => {
        const formData = new FormData();

        // ১. Operations: কুয়েরি এবং ভ্যারিয়েবল সেট করা
        const operations = {
          query: `
            mutation createBroadcast($file: Upload!, $input: CreateBroadcastInput!) {
              createBroadcast(file: $file, input: $input) {
                id
                name
                body
                buttonText
                linkUrl
                attachmentUrl
                scheduledAt
                type
                status
                method
                createdAt
              }
            }
          `,
          variables: {
            file: null, // এটি ম্যাপ দ্বারা রিপ্লেস হবে
            input: {
              name: input.name,
              body: input.body,
              buttonText: input.buttonText,
              linkUrl: input.linkUrl || null,
              scheduledAt: input.scheduledAt || null,
              type: input.type,
              method: input.method,
            },
          },
        };

        formData.append("operations", JSON.stringify(operations));

        // ২. Map: ফাইলটিকে ভ্যারিয়েবলের সাথে ম্যাপ করা (পোস্টম্যান অনুযায়ী)
        const map = {
          "0": ["variables.file"],
        };
        formData.append("map", JSON.stringify(map));

        // ৩. File: আসল ফাইলটি "0" কী-তে অ্যাপেন্ড করা
        if (file) {
          formData.append("0", file);
        }

        return {
          url: "", // আপনার গ্রাফকিউএল এন্ডপয়েন্ট (বক্স ফাঁকা থাকলে বেস ইউআরএল কাজ করবে)
          method: "POST",
          body: formData,
          // নোট: FormData পাঠালে ব্রাউজার নিজেই সঠিক Content-Type (multipart/form-data) সেট করে নেয়।
        };
      },
      invalidatesTags: ["Broadcast"],
    }),

    // Get All Broadcasts Query (যদি প্রয়োজন হয়)
    getBroadcasts: build.query({
      query: () => ({
        body: {
          query: `
            query getBroadcasts {
              getBroadcasts {
                id
                name
                status
                type
                createdAt
              }
            }
          `,
        },
      }),
      providesTags: ["Broadcast"],
    }),
  }),
});

export const { useCreateBroadcastMutation, useGetBroadcastsQuery } = broadcastApi;