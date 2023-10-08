import { createSlice } from '@reduxjs/toolkit';
import type { Payload } from 'types/custom';

export type Teacher = {
  id: number;
  name: string;
};

export type Course = {
  id: number;
  name: string;
  teacher_id: Teacher;
};

export type Session = {
  id: number;
  start_time: string;
  end_time: string;
  course_id: Course;
};

export type Attendance = {
  id: number;
  session_id: Session;
  created_at: string;
  face_recognition_status: 'INITIALIZE' | 'PROCESSING' | 'SUCCESS' | 'FAILED';
  face_image_upload_url: string | null | undefined;
};

export type AttendanceState = {
  currentAttendance: Attendance | null;
};

const slice = createSlice({
  name: 'attendance',
  initialState: {
    currentAttendance: null,
  } as AttendanceState,
  reducers: {
    loadAttendance: (
      state,
      { payload: { attendance } }: Payload<'attendance', Attendance>,
    ) => {
      state.currentAttendance = attendance;
    },
    clearAttendance: state => {
      state.currentAttendance = null;
    },
  },
});

export const { loadAttendance, clearAttendance } = slice.actions;

export default slice.reducer;
