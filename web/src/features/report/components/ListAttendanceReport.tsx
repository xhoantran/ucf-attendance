import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import { formatDate } from "@/utils/format";
import { useListAttendanceReport } from "../api/listAttendanceReport";
import { Badge } from "@/components/Elements";

export const ListAttendanceReport = () => {
  const navigate = useNavigate();
  const listAttendanceReport = useListAttendanceReport();

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-4 pr-3 text-left font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell lg:pl-8"
                >
                  Attendance ID
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-semibold text-gray-900 backdrop-blur backdrop-filter "
                >
                  Student Name
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-semibold text-gray-900 backdrop-blur backdrop-filter "
                >
                  Course Name
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-semibold text-gray-900 backdrop-blur backdrop-filter "
                >
                  Session Date
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-semibold text-gray-900 backdrop-blur backdrop-filter "
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                >
                  <span className="sr-only">Detail</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {listAttendanceReport.data?.map((attendance, attendanceIdx) => (
                <tr key={attendance.id} className="even:bg-gray-50">
                  <td
                    className={clsx(
                      attendanceIdx !== listAttendanceReport.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:table-cell lg:pl-8"
                    )}
                  >
                    {attendance.id}
                  </td>
                  <td
                    className={clsx(
                      attendanceIdx !== listAttendanceReport.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                    )}
                  >
                    {attendance.student_id.name}
                  </td>
                  <td
                    className={clsx(
                      attendanceIdx !== listAttendanceReport.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                    )}
                  >
                    {attendance.session_id.course_id.name}
                  </td>
                  <td
                    className={clsx(
                      attendanceIdx !== listAttendanceReport.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                    )}
                  >
                    {formatDate(attendance.session_id.start_time)}
                  </td>
                  <td
                    className={clsx(
                      attendanceIdx !== listAttendanceReport.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                    )}
                  >
                    <Badge color="red">Failed</Badge>
                  </td>
                  <td
                    className={clsx(
                      attendanceIdx !== listAttendanceReport.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "flex justify-end items-center gap-x-4 py-4 pr-4 pl-3 text-sm font-medium sm:pr-8 lg:pr-8"
                    )}
                  >
                    <button
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => navigate(`/app/reports/${attendance.id}`)}
                    >
                      View
                      <span className="sr-only">
                        , attendance id {attendance.id}
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
