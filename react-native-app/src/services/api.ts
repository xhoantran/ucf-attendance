import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query/react';
import { RootState } from '../store';
import { loadAccess, logout } from '../store/auth';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.access;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithInterceptor: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // Try to refresh the token
    try {
      const refreshResponse = await fetch(
        `${process.env.API_URL}/api-auth/v1/token/refresh/`,
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            refresh: (api.getState() as RootState).auth.refresh,
          }),
        },
      );

      // Refresh token is expired too
      if (refreshResponse.status === 401) {
        api.dispatch(logout());
        return result;
      }

      // Get response body
      const { access } = await refreshResponse.json();
      api.dispatch(loadAccess({ access }));

      // Repeat the request with the new token
      const baseQueryResult = await baseQuery(args, api, extraOptions);
      if (baseQueryResult.error) {
        return baseQueryResult;
      }
      result = baseQueryResult;
    } catch (e) {
      // Network error
      api.dispatch(logout());
    }
  }
  return result;
};

export const api = createApi({
  tagTypes: ['Attendance'],
  baseQuery: baseQueryWithInterceptor,
  endpoints: () => ({}),
});
