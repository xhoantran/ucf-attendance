import { BreadCrumb } from "@/components/Elements/BreadCrumb";
import { ListAttendanceReport } from "../components/ListAttendanceReport";

export const AttendanceReports = () => {
  return (
    <>
      <BreadCrumb
        pages={[{ name: "Reports", href: "/app/reports", current: false }]}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold leading-4 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Attendance Reports
          </h2>
        </div>
      </div>
      <ListAttendanceReport />
    </>
  );
};
