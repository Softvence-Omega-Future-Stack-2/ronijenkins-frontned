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
            id name slug description thumbnail videoUrl
            status type time category createdAt
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
transformResponse: (response: any) => {
  console.log("📥 page response:", JSON.stringify(response));
  return {
    data: response?.data ?? [],
    meta: response?.meta ?? { page: 1, limit: 5, total: 0, totalPage: 1 },
  };
},
  providesTags: (_result, _err, arg) => [
    { type: "Content" as const, id: "LIST" },
    { type: "Content" as const, id: `LIST-PAGE-${arg?.page ?? 1}` },
  ],
  keepUnusedDataFor: 0, 
  forceRefetch: () => true, 
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

    const operations = JSON.stringify({
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
        video: null,
      },
    });

formData.append("operations", operations);


const map: Record<string, string[]> = {};
if (data.thumbnail) map["0"] = ["variables.thumbnail"];
if (data.video)     map["1"] = ["variables.video"];
formData.append("map", JSON.stringify(map))
const files: File[] = [];

if (data.thumbnail) formData.append("0", data.thumbnail);
if (data.video)     formData.append("1", data.video);

formData.append("map", JSON.stringify(map));


files.forEach((file, index) => {
  formData.append(String(index), file);
});
// debug
for (const pair of formData.entries()) {
  console.log('FormData entry:', pair[0], pair[1]);
}
// return এর আগে
for (const pair of formData.entries()) {
  console.log('FormData:', pair[0], pair[1]);
}
    return {
      url: "",
      method: "POST",
      body: formData,
      formData: true,
    };
  },
transformResponse: (response: any) => {
  console.log('createContent raw:', response);
  
  // GraphQL error check
  if (response?.errors?.length) {
    throw new Error(response.errors[0].message);
  }
  
  return response?.data?.createContent ?? response;
},
  invalidatesTags: [{ type: "Content" as const, id: "LIST" }],
}),
    // UPDATE CONTENT 
    updateContent: build.mutation<
  ContentItem,
  {
    id: string;
    input: UpdateContentInput;
    thumbnail?: File | null;
    video?: File | null;
  }
>({
  query: ({ id, input, thumbnail, video }) => {
    const formData = new FormData();

    const operations = JSON.stringify({
      query: `
        mutation updateContent(
          $id: String! 
          $input: UpdateContentInput!
          $thumbnail: Upload
          $video: Upload
        ) {
          updateContent(
            id: $id
            input: $input
            thumbnail: $thumbnail
            video: $video
          ) {
            ${CONTENT_FIELDS}
          }
        }
      `,
      variables: {
        id,
        input,
        thumbnail: null,
        video: null,
      },
    });

    formData.append("operations", operations);

    // 🔥 dynamic map (safe way)
    const map: Record<string, string[]> = {};
    let i = 0;

    if (thumbnail) {
      map[i] = ["variables.thumbnail"];
      formData.append(i.toString(), thumbnail);
      i++;
    }

    if (video) {
      map[i] = ["variables.video"];
      formData.append(i.toString(), video);
    }

    formData.append("map", JSON.stringify(map));

    return {
      url: "/graphql", // ✅ important
      method: "POST",
      body: formData,
      formData: true,
    };
  },

  transformResponse: (response: any): ContentItem => {
    console.log("updateContent raw:", response);

    // ✅ GraphQL error handle
    if (response?.errors?.length > 0) {
      throw new Error(response.errors[0].message);
    }

    return response?.data?.updateContent;
  },

  invalidatesTags: (_result, _err, { id }) => [
    { type: "Content", id },
    { type: "Content", id: "LIST" },
  ],
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