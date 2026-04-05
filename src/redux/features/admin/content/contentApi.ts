/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseAPI } from "../../../api/baseApi";

export interface CreateContentInput {
  name: string;
  slug: string;
  description: string;
  time: number;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  type: 'ARTICLE' | 'VIDEO' | 'AUDIO';
  category: string;
  notify: boolean;
  locked: boolean;
}
 
export interface UpdateContentInput {
  name?: string;
  description?: string;
  time?: number;
  status?: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  type?: 'ARTICLE' | 'VIDEO' | 'AUDIO';
  category?: string;
  notify?: boolean;
  locked?: boolean;
}
 
export interface ContentItem {
  id: string;
  name: string;
  slug: string;
  date:string
  description: string | null;
  type: 'ARTICLE' | 'VIDEO' | 'AUDIO';
  category: string | null;
  time: number | null;
  thumbnail: string | null;
  notify: boolean;
  locked: boolean;
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED';
  videoUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

const CONTENT_FIELDS = `
  id name slug description type category time
  thumbnail notify locked status videoUrl createdAt updatedAt
`;
export const contentAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({


   // getAllContents query fix 

getAllContents: build.query({
  query: (pagination?: { page?: number; limit?: number }) => ({
    url: "",
    method: "POST",
    body: {
      query: `
        query getAllContents($input: GetAllGenericArgs) {
          getAllContents(input: $input) {
            id
            name
            slug
            description
            thumbnail
            videoUrl
            status
            type
            time
            category
            createdAt
          }
        }
      `,
      variables: {
        input: {
          pagination: {
            page: pagination?.page ?? 1,
            limit: pagination?.limit ?? 10,
          },
        },
      },
    },
  }),
  // ✅ server returns { meta, data: [...] } directly — NOT under data.getAllContents
  transformResponse: (response: any) => {
    console.log("📥 raw response:", response);
    return {
      data: response?.data ?? [],
      meta: response?.meta ?? { page: 1, limit: 10, total: 0, totalPage: 1 },
    };
  },
  // providesTags: ["Content"],
  providesTags: [{ type: "Content" as const, id: "LIST" }],
}),

    // ================= GET CONTENT BY ID =================
  getContentById: build.query({
  query: (id: string) => ({
    url: "",
    method: "POST",
    body: {
      query: `
        query getContentById($id: String!) {
          getContentById(id: $id) {
            id name slug description thumbnail videoUrl status type time category createdAt
          }
        }
      `,
      variables: { id },
    },
  }),
  // ✅ response.data.getContentById — এটা ঠিক আছে কিনা check করি
  transformResponse: (response: any) => {
    console.log(" getContentById raw:", response);
    return response?.data?.getContentById ?? response?.data ?? null;
  },
}),
    // GET CONTENT BY SLUG 
    getContentBySlug: build.query({
      query: (slug: string) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            query getContentBySlug($slug: String!) {
              getContentBySlug(slug: $slug) {
                id name slug description thumbnail videoUrl status type time category createdAt
              }
            }
          `,
          variables: { slug },
        },
      }),
      transformResponse: (res: any) => res?.data?.getContentBySlug,
    }),

    //  CREATE CONTENT 
createContent: build.mutation({
  query: (data: { input: any; thumbnail?: File | null; video?: File | null }) => {
    const formData = new FormData();

    // ১. অপারেশনস তৈরি করা
    const operations = {
      query: `
        mutation createContent($input: CreateContentInput!, $thumbnail: Upload, $video: Upload) {
          createContent(input: $input, thumbnail: $thumbnail, video: $video) {
            id
            name
            slug
            thumbnail
            videoUrl
          }
        }
      `,
      variables: { 
        input: data.input, 
        thumbnail: null, 
        video: null 
      },
    };
    formData.append("operations", JSON.stringify(operations));

    // ২. ডাইনামিক ম্যাপ তৈরি (ফাইল থাকলেই কেবল অ্যাড হবে)
 const map: Record<string, string[]> = {};
let fileIndex = 0;

if (data.thumbnail) {
  map[fileIndex] = ["variables.thumbnail"];
  formData.append(String(fileIndex), data.thumbnail);
  fileIndex++;
}

if (data.video) {
  map[fileIndex] = ["variables.video"];
  formData.append(String(fileIndex), data.video);
  fileIndex++;
}

formData.append("map", JSON.stringify(map));

    
  

    return {
      url: "", // আপনার baseApi-তে যদি /graphql দেওয়া থাকে তবে এটি খালি রাখুন
      method: "POST",
      body: formData,
      // RTK Query স্বয়ংক্রিয়ভাবে Content-Type সেট করবে যদি আপনি এটি undefined রাখেন
    };

    
  },
  
  invalidatesTags: ["Content"],
}),

    // UPDATE CONTENT 
updateContent: build.mutation<
      ContentItem,
      { id: string; input: UpdateContentInput; thumbnail?: File | null; video?: File | null }
    >({
      query: ({ id, input, thumbnail, video }) => {
        const formData = new FormData();
 
        const operations = JSON.stringify({
          query: `
            mutation updateContent(
              $id: ID!
              $input: UpdateContentInput!
              $thumbnail: Upload
              $video: Upload
            ) {
              updateContent(id: $id, input: $input, thumbnail: $thumbnail, video: $video) {
                ${CONTENT_FIELDS}
              }
            }
          `,
          variables: { id, input, thumbnail: null, video: null },
        });
 
        formData.append('operations', operations);
 
        const map: Record<string, string[]> = {};
        if (thumbnail) map['0'] = ['variables.thumbnail'];
        if (video)     map['1'] = ['variables.video'];
        formData.append('map', JSON.stringify(map));
 
        if (thumbnail) formData.append('0', thumbnail);
        if (video)     formData.append('1', video);
 
        return { url: '', method: 'POST', body: formData };
      },
      transformResponse: (response: any): ContentItem =>
        response?.data?.updateContent ?? response?.updateContent,
      // Invalidate both the specific item and the whole list
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Content', id }, 'Content'],
    }),
 


    // DELETE CONTENT 
    deleteContent: build.mutation({
      query: (id: string) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            mutation deleteContentById($id: String!) {
              deleteContentById(id: $id) { id name }
            }
          `,
          variables: { id },
        },
      }),
      invalidatesTags: ["Content"],
    }),

  }),
});

export const {
  useGetAllContentsQuery,
  useGetContentByIdQuery,
  useGetContentBySlugQuery,
  useCreateContentMutation,
  useUpdateContentMutation,
  useDeleteContentMutation,
} = contentAPI;





// /* eslint-disable @typescript-eslint/no-explicit-any */

// import { baseAPI } from "../../../api/baseApi";


// export const contentAPI = baseAPI.injectEndpoints({
//   endpoints: (build) => ({

//     // ================= GET ALL CONTENT =================
//     getAllContents: build.query({
//       query: (input?: any) => ({
//         url: "",
//         method: "POST",
//         body: {
//           query: `
//             query getAllContents($input: GetAllUsersArgs) {
//               getAllContents(input: $input) {
//                 id
//                 name
//                 slug
//                 description
//                 thumbnail
//                 videoUrl
//                 status
//                 type
//                 time
//                 category
//                 createdAt
//               }
//             }
//           `,
//           variables: { input },
//         },
//       }),
//       transformResponse: (response: any) => response?.data?.getAllContents,
//       providesTags: ["Content"],
//     }),


//     getContentById: build.query({
//       query: (id: string) => ({
//         url: "",
//         method: "POST",
//         body: {
//           query: `
//             query getContentById($id: String!) {
//               getContentById(id: $id) {
//                 id
//                 name
//                 slug
//                 description
//                 thumbnail
//                 videoUrl
//                 status
//                 type
//                 time
//                 category
//                 createdAt
//               }
//             }
//           `,
//           variables: { id },
//         },
//       }),
//       transformResponse: (res: any) => res?.data?.getContentById,
//     }),

//     // ================= GET CONTENT BY SLUG =================
//     getContentBySlug: build.query({
//       query: (slug: string) => ({
//         url: "",
//         method: "POST",
//         body: {
//           query: `
//             query getContentBySlug($slug: String!) {
//               getContentBySlug(slug: $slug) {
//                 id
//                 name
//                 slug
//                 description
//                 thumbnail
//                 videoUrl
//                 status
//                 type
//                 time
//                 category
//                 createdAt
//               }
//             }
//           `,
//           variables: { slug },
//         },
//       }),
//       transformResponse: (res: any) => res?.data?.getContentBySlug,
//     }),

//     // ================= CREATE CONTENT =================
//     createContent: build.mutation({
//       query: (data: {
//         input: any;
//         thumbnail?: File | null;
//         video?: File | null;
//       }) => {
//         const formData = new FormData();

//         formData.append(
//           "operations",
//           JSON.stringify({
//             query: `
//               mutation createContent(
//                 $input: CreateContentInput!,
//                 $thumbnail: Upload,
//                 $video: Upload
//               ) {
//                 createContent(
//                   input: $input,
//                   thumbnail: $thumbnail,
//                   video: $video
//                 ) {
//                   id
//                   name
//                   slug
//                   thumbnail
//                   videoUrl
//                 }
//               }
//             `,
//             variables: {
//               input: data.input,
//               thumbnail: null,
//               video: null,
//             },
//           })
//         );

//         const map: any = {};
//         let i = 0;

//         if (data.thumbnail) {
//           map[i] = ["variables.thumbnail"];
//           i++;
//         }
//         if (data.video) {
//           map[i] = ["variables.video"];
//         }

//         formData.append("map", JSON.stringify(map));

//         let fileIndex = 0;
//         if (data.thumbnail) {
//           formData.append(`${fileIndex}`, data.thumbnail);
//           fileIndex++;
//         }
//         if (data.video) {
//           formData.append(`${fileIndex}`, data.video);
//         }

//         return {
//           url: "",
//           method: "POST",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["Content"],
//     }),

//     // ================= UPDATE CONTENT =================
//     updateContent: build.mutation({
//       query: (data: {
//         id: string;
//         input: any;
//         thumbnail?: File | null;
//         video?: File | null;
//       }) => {
//         const formData = new FormData();

//         formData.append(
//           "operations",
//           JSON.stringify({
//             query: `
//               mutation updateContent(
//                 $id: String!,
//                 $input: UpdateContentInput!,
//                 $thumbnail: Upload,
//                 $video: Upload
//               ) {
//                 updateContent(
//                   id: $id,
//                   input: $input,
//                   thumbnail: $thumbnail,
//                   video: $video
//                 ) {
//                   id
//                   name
//                   slug
//                   thumbnail
//                   videoUrl
//                   status
//                 }
//               }
//             `,
//             variables: {
//               id: data.id,
//               input: data.input,
//               thumbnail: null,
//               video: null,
//             },
//           })
//         );

//         const map: any = {};
//         let i = 0;

//         if (data.thumbnail) {
//           map[i] = ["variables.thumbnail"];
//           i++;
//         }
//         if (data.video) {
//           map[i] = ["variables.video"];
//         }

//         formData.append("map", JSON.stringify(map));

//         let fileIndex = 0;
//         if (data.thumbnail) {
//           formData.append(`${fileIndex}`, data.thumbnail);
//           fileIndex++;
//         }
//         if (data.video) {
//           formData.append(`${fileIndex}`, data.video);
//         }

//         return {
//           url: "",
//           method: "POST",
//           body: formData,
//         };
//       },
//       invalidatesTags: ["Content"],
//     }),

//     // ================= DELETE CONTENT =================
//     deleteContent: build.mutation({
//       query: (id: string) => ({
//         url: "",
//         method: "POST",
//         body: {
//           query: `
//             mutation deleteContentById($id: String!) {
//               deleteContentById(id: $id) {
//                 id
//                 name
//               }
//             }
//           `,
//           variables: { id },
//         },
//       }),
//       invalidatesTags: ["Content"],
//     }),

//   }),
// });

// export const {
//   useGetAllContentsQuery,
//   useGetContentByIdQuery,
//   useGetContentBySlugQuery,
//   useCreateContentMutation,
//   useUpdateContentMutation,
//   useDeleteContentMutation,
// } = contentAPI;