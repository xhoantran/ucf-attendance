import { api } from '@/services/api';
import type { Attendance } from '@/store/attendance';

export const attendanceApi = api.injectEndpoints({
  endpoints: build => ({
    createAttendance: build.mutation<Attendance, string>({
      query: token => ({
        url: '/api/v1/attendance/',
        method: 'POST',
        body: {
          token,
        },
      }),
    }),
    listAttendance: build.query<Attendance[], void>({
      query: () => '/api/v1/attendance/',
    }),
  }),
});

export const { useCreateAttendanceMutation, useListAttendanceQuery } =
  attendanceApi;
