import { createSlice } from '@reduxjs/toolkit';
import type { Payload } from 'types/custom';

export type User = {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
};

export type AuthState = {
  access: string | null;
  refresh: string | null;
  user: User | null;
};

type LoginPayload = {
  payload: {
    access: string;
    refresh: string;
    user: User;
  };
};

const slice = createSlice({
  name: 'auth',
  initialState: {
    access: null,
    refresh: null,
    user: null,
  } as AuthState,
  reducers: {
    loadUser: (state, { payload: { user } }: Payload<'user', User>) => {
      state.user = user;
    },
    loadAccess: (state, { payload: { access } }: Payload<'access', string>) => {
      state.access = access;
    },
    login: (state, { payload: { access, refresh, user } }: LoginPayload) => {
      state.access = access;
      state.refresh = refresh;
      state.user = user;
    },
    logout: state => {
      state.access = null;
      state.refresh = null;
      state.user = null;
    },
  },
});

export const { loadUser, login, logout, loadAccess } = slice.actions;

export default slice.reducer;
