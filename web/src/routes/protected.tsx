import { Suspense } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { Spinner } from "@/components/Elements";
import { MainLayout } from "@/components/Layout";
import { NoAccess } from "@/components/NoAccess";
import { ROLES } from "@/features/auth";
import { useAuth } from "@/stores/useAuth";
import { lazyImport } from "@/utils/lazyImport";

const { CourseRoutes } = lazyImport(
  () => import("@/features/courses"),
  "CourseRoutes"
);
const { SessionRoutes } = lazyImport(
  () => import("@/features/sessions"),
  "SessionRoutes"
);
const { AttendanceReportRoutes } = lazyImport(
  () => import("@/features/report"),
  "AttendanceReportRoutes"
);

const App = () => {
  const auth = useAuth();

  if (auth.user?.role !== ROLES.TEACHER) {
    return <NoAccess />;
  }

  return (
    <MainLayout>
      <Suspense
        fallback={
          <div className="h-full w-full flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        }
      >
        <Outlet />
      </Suspense>
    </MainLayout>
  );
};

export const protectedRoutes = [
  {
    path: "/app",
    element: <App />,
    children: [
      { path: "/app/courses/*", element: <CourseRoutes /> },
      { path: "/app/sessions/*", element: <SessionRoutes /> },
      {
        path: "/app/reports/*",
        element: <AttendanceReportRoutes />,
      },
      { path: "*", element: <Navigate to="." /> },
    ],
  },
  { path: "*", element: <Navigate to="/app" /> },
];
