import { Navigate, Route, Routes } from "react-router-dom";
import { Courses } from "./Courses";
import { CourseDetail } from "./CourseDetail";

export const CourseRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Courses />} />
      <Route path=":courseId/*" element={<CourseDetail />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
