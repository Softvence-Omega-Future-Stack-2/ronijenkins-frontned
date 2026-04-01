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

    // ✅ redux-persist stores strings as JSON: "\"eyJ...\"" → parse it
    if (token) {
      try {
        const parsed = JSON.parse(token);
        if (typeof parsed === 'string') token = parsed;
      } catch {
        // already a clean string, use as-is
      }
    }

    if (!token || token === "undefined" || token === "null") token = null;

    const publicEndpoints = [
      "login", "register", "verifyOTP", "forgotPassword", "resetPassword",
    ];
    const isPublic = publicEndpoints.some((e) =>
      endpoint?.toLowerCase().includes(e.toLowerCase())
    );

    if (token && !isPublic) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQuery(args, api, extraOptions);

  const errors = (result.data as any)?.errors;
  const isUnauthorized =
    result?.error?.status === 401 ||
    errors?.[0]?.message?.toLowerCase().includes("unauthorized") ||
    errors?.[0]?.message?.toLowerCase().includes("no token provided") ||
    errors?.[0]?.message?.toLowerCase().includes("invalid token");

  if (result?.error || errors) {
    if (isUnauthorized) {
      const state = api.getState() as RootState;
      let refreshToken = state.auth.refreshToken;

      // ✅ parse refresh token too
      if (refreshToken) {
        try {
          const parsed = JSON.parse(refreshToken);
          if (typeof parsed === 'string') refreshToken = parsed;
        } catch { /* already clean */ }
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

        const newToken =
          (refreshResult?.data as any)?.data?.refreshToken?.accessToken;

        if (newToken) {
          api.dispatch(
            setCredentials({
              user: state.auth.user,
              token: newToken,
              refreshToken,
            })
          );

          const retryArgs =
            typeof args === "string"
              ? args
              : {
                  ...args,
                  headers: {
                    ...(args.headers || {}),
                    Authorization: `Bearer ${newToken}`,
                  },
                };

          result = await baseQuery(retryArgs, api, extraOptions);
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
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: "baseAPI",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Auth", "Content", "AdminProfile", "Users", "Appointments", "Notifications"],
  endpoints: () => ({}),
});