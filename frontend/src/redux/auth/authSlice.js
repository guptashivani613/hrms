// src/features/auth/authSlice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const authSlice = createSlice({
  name: 'auth',

  initialState: {
    user: null,
    access_token: Cookies.get('access_token') || null,
    refresh_token: Cookies.get('refresh_token') || null,
    isAuthenticated: !!Cookies.get('token'),
  },

  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.access_token = action.payload.access_token;
      state.refresh_token = action.payload.refresh_token;
      state.isAuthenticated = true;
      Cookies.set('access_token', action.payload.access_token, { expires: 7 });
      Cookies.set('refresh_token', action.payload.refresh_token, { expires: 7 });
      Cookies.set('userData', JSON.stringify(action.payload), { expires: 7 });
      Cookies.set('userType', action.payload.userType, { expires: 7 });
    },
    logout: (state) => {
      state.user = null;
      state.access_token = null;
      state.refresh_token = null;
      state.isAuthenticated = false;
      Cookies.remove('access_token');
      Cookies.remove('refresh_token');
      Cookies.remove('userData');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
