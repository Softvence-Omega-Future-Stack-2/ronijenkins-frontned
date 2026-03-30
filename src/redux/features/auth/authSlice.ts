/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
  isAuthenticated: !!localStorage.getItem("isLoggedIn"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;

      state.user = user;
      state.token = token || state.token;
      state.refreshToken = refreshToken || state.refreshToken;
      state.isAuthenticated = true;
      localStorage.setItem("isLoggedIn", "true");

      if (token && token !== "undefined") {
        localStorage.setItem("token", token);
      }
      if (refreshToken && refreshToken !== "undefined") {
        localStorage.setItem("refreshToken", refreshToken);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("isLoggedIn");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;