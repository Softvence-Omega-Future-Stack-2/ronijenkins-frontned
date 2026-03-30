/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';
import { setCredentials, logout } from '../features/auth/authSlice';

// Helper to get a cookie by name
const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return null;
};

const baseQueryAPI = fetchBaseQuery({
  baseUrl: '/graphql',
  credentials: 'include',
  prepareHeaders: (headers, { getState, endpoint }) => {
    const state = getState() as RootState;
    // Prioritize cookie over Redux state
    let token = getCookie("access_token") || getCookie("accessToken") || getCookie("token") || state.auth.token;

    if (!token || token === 'undefined') token = null;

    const publicEndpoints = [
      'login', 'register', 'verifyOTP', 'forgotPassword', 'resetPassword'
    ];

    const isPublic = publicEndpoints.some(e => endpoint?.toLowerCase().includes(e.toLowerCase()));

    if (token && !isPublic) headers.set('Authorization', `${token}`);

    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result = await baseQueryAPI(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const state = api.getState() as RootState;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      const refreshResult = await baseQueryAPI(
        { url: '/accounts/token-refresh/', method: 'POST', body: { refresh: refreshToken } },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const newToken = (refreshResult.data as any).access;
        api.dispatch(setCredentials({
          user: state.auth.user,
          token: newToken,
          refreshToken,
        }));

        const retryArgs = typeof args === 'string' ? args : {
          ...args,
          headers: { ...(args.headers || {}), Authorization: `${newToken}` },
        };
        result = await baseQueryAPI(retryArgs, api, extraOptions);
      } else { api.dispatch(logout()); window.location.href = '/login';
      }
    } else {
      api.dispatch(logout());
      window.location.href = '/login';
    }
  }

  return result;
};

export const baseAPI = createApi({
  reducerPath: 'baseAPI',
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    'Users', 'Appointments', 'Notifications', 'Analytics'
  ],
  endpoints: () => ({}),
});