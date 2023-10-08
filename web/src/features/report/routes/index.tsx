import { Navigate, Route, Routes } from "react-router-dom";
import { AttendanceReports } from "./AttendanceReports";
import { AttendanceReportDetail } from "./AttendanceReportDetail";

export const AttendanceReportRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AttendanceReports />} />
      <Route path=":attendanceId" element={<AttendanceReportDetail />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
