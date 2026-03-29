/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  refreshToken: localStorage.getItem("refreshToken"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token, refreshToken } = action.payload;

      if (!token || token === "undefined") return;

      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;

      localStorage.setItem("token", token);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;