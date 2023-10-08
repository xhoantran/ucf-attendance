import { api } from '../../api';
import type { User } from '../../../store/auth';

export const userApi = api.injectEndpoints({
  endpoints: build => ({
    getUserDetail: build.query<User, void>({
      query: () => '/api-auth/v1/me/',
    }),
  }),
  overrideExisting: false,
});

export const { useLazyGetUserDetailQuery } = userApi;
