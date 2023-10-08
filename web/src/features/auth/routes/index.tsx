import { Navigate, Route, Routes } from "react-router-dom";

import { Login } from "./Login";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="*" element={<Navigate to="login" />} />
    </Routes>
  );
};
