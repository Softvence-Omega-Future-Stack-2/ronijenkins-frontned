/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: any;
  token: string | null;
  refreshToken: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,        
  refreshToken: null,
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
      state.refreshToken = refreshToken ?? null;

      
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;