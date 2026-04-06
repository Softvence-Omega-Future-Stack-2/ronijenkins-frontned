/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../store";
import { setCredentials, logout } from "../features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl:
    import.meta.env.VITE_API_URL ||
    "https://ronijenkinsserver-production.up.railway.app/graphql",

  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    let token = state.auth.token;

    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (typeof parsed === 'string') token = parsed;
      } catch { }
    }

    if (!token || token === "undefined" || token === "null") token = null;

    const publicEndpoints = ["login", "register", "verifyOTP", "forgotPassword", "resetPassword"];
    const isPublic = publicEndpoints.some((e) =>
      endpoint?.toLowerCase().includes(e.toLowerCase())
    );

    if (token && !isPublic) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

const baseQueryWithReauth = async (
  args: any,
  api: any,
  extraOptions: any
): Promise<any> => {
  const isFormData = args?.body instanceof FormData;
  let result: any;

  
  if (isFormData) {
    const state = api.getState() as RootState;
    let token = state.auth.token;
    
    // Token parsing
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (typeof parsed === 'string') token = parsed;
      } catch { }
    }
    if (!token || token === "undefined" || token === "null") token = null;

    const baseUrl = import.meta.env.VITE_API_URL || "https://ronijenkinsserver-production.up.railway.app/graphql";

    try {
      const fetchHeaders: Record<string, string> = {};
      if (token) fetchHeaders["Authorization"] = `Bearer ${token}`;

      const response = await fetch(baseUrl, {
        method: "POST",
        headers: fetchHeaders,
        body: args.body,
      });

      const jsonResponse = await response.json();
      // ✅ RTK Query standard format
      result = { data: jsonResponse }; 
      
    } catch (error: any) {
      result = { error: { status: "FETCH_ERROR", error: error.message } };
    }
  } else {
    const modifiedArgs = typeof args === "string"
      ? args
      : {
          ...args,
          headers: {
            ...(args.headers || {}),
            "Content-Type": "application/json",
          },
        };
    result = await baseQuery(modifiedArgs, api, extraOptions);
  }

  // ── Reauth Logic ────────────────────────────────────────────────────────
  const errors = (result?.data as any)?.errors || (result as any)?.errors;
  
  const isUnauthorized =
    result?.error?.status === 401 ||
    errors?.[0]?.message?.toLowerCase().includes("unauthorized") ||
    errors?.[0]?.message?.toLowerCase().includes("no token provided") ||
    errors?.[0]?.message?.toLowerCase().includes("invalid token");

  if ((result?.error || errors) && isUnauthorized) {
    const state = api.getState() as RootState;
    let refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      try {
        const parsed = JSON.parse(refreshToken);
        if (typeof parsed === 'string') refreshToken = parsed;
      } catch { }
    }

    if (!refreshToken) {
      api.dispatch(logout());
      window.location.href = "/login";
      return result;
    }

    try {
      const refreshResult = await baseQuery(
        {
          url: "",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: {
            query: `
              mutation RefreshToken($refreshToken: String!) {
                refreshToken(refreshToken: $refreshToken) {
                  accessToken
                }
              }
            `,
            variables: { refreshToken },
          },
        },
        api,
        extraOptions
      );

      const newToken = (refreshResult?.data as any)?.data?.refreshToken?.accessToken;

      if (newToken) {
        api.dispatch(setCredentials({
          user: state.auth.user,
          token: newToken,
          refreshToken,
        }));
        result = await baseQueryWithReauth(args, api, extraOptions);
      } else {
        api.dispatch(logout());
        window.location.href = "/login";
      }
    } catch (err) {
      console.error("Refresh token failed", err);
      api.dispatch(logout());
      window.location.href = "/login";
    }
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Broadcast", "Overview", "Content", "AdminProfile", "Users", "HealthGoals","Customers", "Subscription", "Appointments", "Notifications"],
  endpoints: () => ({}),
});







// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import type { RootState } from "../store";
// import { setCredentials, logout } from "../features/auth/authSlice";

// const baseQuery = fetchBaseQuery({
//   baseUrl:
//     import.meta.env.VITE_API_URL ||
//     "https://ronijenkinsserver-production.up.railway.app/graphql",

//   prepareHeaders: (headers, { getState, endpoint }) => {
//   const state = getState() as RootState;
//   let token = state.auth.token;

//   if (token) {
//     try {
//       const parsed = JSON.parse(token);
//       if (typeof parsed === 'string') token = parsed;
//     } catch { }
//   }

//   if (!token || token === "undefined" || token === "null") token = null;

//   const publicEndpoints = ["login", "register", "verifyOTP", "forgotPassword", "resetPassword"];
//   const isPublic = publicEndpoints.some((e) => endpoint?.toLowerCase().includes(e.toLowerCase()));

//   if (token && !isPublic) {
//     headers.set("Authorization", `Bearer ${token}`);
//   }

//   // ✅ Content-Type শুধু তখনই set করবে যখন already set নেই
//   if (!headers.get("Content-Type")) {
//     headers.set("Content-Type", "application/json");
//   }

//   return headers;
// },
// });

// const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
//   let result = await baseQuery(args, api, extraOptions);

//   const errors = (result.data as any)?.errors;
//   const isUnauthorized =
//     result?.error?.status === 401 ||
//     errors?.[0]?.message?.toLowerCase().includes("unauthorized") ||
//     errors?.[0]?.message?.toLowerCase().includes("no token provided") ||
//     errors?.[0]?.message?.toLowerCase().includes("invalid token");

//   if (result?.error || errors) {
//     if (isUnauthorized) {
//       const state = api.getState() as RootState;
//       let refreshToken = state.auth.refreshToken;

//       // ✅ parse refresh token too
//       if (refreshToken) {
//         try {
//           const parsed = JSON.parse(refreshToken);
//           if (typeof parsed === 'string') refreshToken = parsed;
//         } catch { /* already clean */ }
//       }

//       if (!refreshToken) {
//         api.dispatch(logout());
//         window.location.href = "/login";
//         return result;
//       }

//       try {
//         const refreshResult = await baseQuery(
//           {
//             url: "",
//             method: "POST",
//             body: {
//               query: `
//                 mutation RefreshToken($refreshToken: String!) {
//                   refreshToken(refreshToken: $refreshToken) {
//                     accessToken
//                   }
//                 }
//               `,
//               variables: { refreshToken },
//             },
//           },
//           api,
//           extraOptions
//         );

//         const newToken =
//           (refreshResult?.data as any)?.data?.refreshToken?.accessToken;

//         if (newToken) {
//           api.dispatch(
//             setCredentials({
//               user: state.auth.user,
//               token: newToken,
//               refreshToken,
//             })
//           );

//           const retryArgs =
//             typeof args === "string"
//               ? args
//               : {
//                   ...args,
//                   headers: {
//                     ...(args.headers || {}),
//                     Authorization: `Bearer ${newToken}`,
//                   },
//                 };

//           result = await baseQuery(retryArgs, api, extraOptions);
//         } else {
//           api.dispatch(logout());
//           window.location.href = "/login";
//         }
//       } catch (err) {
//         console.error("Refresh token failed", err);
//         api.dispatch(logout());
//         window.location.href = "/login";
//       }
//     }
//   }

//   return result;
// };

// export const baseAPI = createApi({
//   reducerPath: "baseAPI",
//   baseQuery: baseQueryWithReauth,
//   tagTypes: ["Auth", "Content", "AdminProfile", "Users", "Appointments", "Notifications"],
//   endpoints: () => ({}),
// });