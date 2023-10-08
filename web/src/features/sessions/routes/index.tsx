import { Navigate, Route, Routes } from "react-router-dom";
import { SessionDetail } from "./SessionDetail";

export const SessionRoutes = () => {
  return (
    <Routes>
      <Route path=":sessionId/*" element={<SessionDetail />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};
