/* eslint-disable @typescript-eslint/no-explicit-any */
import { baseAPI } from "../../../api/baseApi";

export const contentAPI = baseAPI.injectEndpoints({
  endpoints: (build) => ({

    // ================= GET ALL CONTENT =================
    getAllContents: build.query({
      query: (input?: any) => ({
        url: "",
        method: "POST",
        body: {
          query: `
            query getAllContents($input: GetAllUsersArgs) {
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
          variables: { input },
        },
      }),
      // ✅ server returns { data: { meta, data: [...] } }
      transformResponse: (response: any) => {
        console.log("📥 getAllContents raw:", response);
        return response?.data?.getAllContents?.data   // paginated shape
          ?? response?.data?.getAllContents           // array shape
          ?? response?.data?.data                    // fallback
          ?? [];
      },
      providesTags: ["Content"],
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
      transformResponse: (res: any) => res?.data?.getContentById,
    }),

    // ================= GET CONTENT BY SLUG =================
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

    // ================= CREATE CONTENT =================
    createContent: build.mutation({
      query: (data: { input: any; thumbnail?: File | null; video?: File | null }) => {
        const formData = new FormData();
        formData.append("operations", JSON.stringify({
          query: `
            mutation createContent($input: CreateContentInput!, $thumbnail: Upload, $video: Upload) {
              createContent(input: $input, thumbnail: $thumbnail, video: $video) {
                id name slug thumbnail videoUrl
              }
            }
          `,
          variables: { input: data.input, thumbnail: null, video: null },
        }));

        const map: any = {};
        let i = 0;
        if (data.thumbnail) { map[i] = ["variables.thumbnail"]; i++; }
        if (data.video)     { map[i] = ["variables.video"]; }
        formData.append("map", JSON.stringify(map));

        let idx = 0;
        if (data.thumbnail) { formData.append(`${idx}`, data.thumbnail); idx++; }
        if (data.video)     { formData.append(`${idx}`, data.video); }

        return { url: "", method: "POST", body: formData };
      },
      invalidatesTags: ["Content"],
    }),

    // ================= UPDATE CONTENT =================
    updateContent: build.mutation({
      query: (data: { id: string; input: any; thumbnail?: File | null; video?: File | null }) => {
        const formData = new FormData();
        formData.append("operations", JSON.stringify({
          query: `
            mutation updateContent($id: String!, $input: UpdateContentInput!, $thumbnail: Upload, $video: Upload) {
              updateContent(id: $id, input: $input, thumbnail: $thumbnail, video: $video) {
                id name slug thumbnail videoUrl status
              }
            }
          `,
          variables: { id: data.id, input: data.input, thumbnail: null, video: null },
        }));

        const map: any = {};
        let i = 0;
        if (data.thumbnail) { map[i] = ["variables.thumbnail"]; i++; }
        if (data.video)     { map[i] = ["variables.video"]; }
        formData.append("map", JSON.stringify(map));

        let idx = 0;
        if (data.thumbnail) { formData.append(`${idx}`, data.thumbnail); idx++; }
        if (data.video)     { formData.append(`${idx}`, data.video); }

        return { url: "", method: "POST", body: formData };
      },
      invalidatesTags: ["Content"],
    }),

    // ================= DELETE CONTENT =================
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