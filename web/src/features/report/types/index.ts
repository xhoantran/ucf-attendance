import type { TypeAttendance } from "@/features/sessions/types";

export interface TypeAttendanceReport extends TypeAttendance {
  face_image: string;
  init_face_image: string;
}
