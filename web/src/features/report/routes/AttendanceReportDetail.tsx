import { Badge } from "@/components/Elements";
import { BreadCrumb } from "@/components/Elements/BreadCrumb";
import { formatDate } from "@/utils/format";
import { useParams } from "react-router-dom";
import { useGetAttendanceReport } from "../api/getAttendanceReport";
import { useOverrideAttendance } from "../api/overrideAttendance";

export const AttendanceReportDetail = () => {
  const { attendanceId } = useParams() as { attendanceId: string };

  const getAttendanceReport = useGetAttendanceReport({ attendanceId });
  const overrideAttendance = useOverrideAttendance();

  return (
    <>
      <BreadCrumb
        pages={[
          { name: "Reports", href: "/app/reports", current: false },
          {
            name: attendanceId,
            href: "",
            current: true,
          },
        ]}
      />

      <div className="relative border-gray-200 pb-5 sm:pb-0">
        {/* Headers */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              Attendance Report
            </h2>
          </div>
          <div>
            <button
              type="button"
              className="rounded-md bg-blue-600 ml-3 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              onClick={() => overrideAttendance.mutate({ attendanceId })}
            >
              Override
            </button>
          </div>
        </div>
      </div>

      {/* Component based on tab */}
      <div>
        <div className="mt-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2">
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Full name
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {getAttendanceReport.data?.student_id.name}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Course
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {getAttendanceReport.data?.session_id.course_id.name}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Email address
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {getAttendanceReport.data?.student_id.email}
              </dd>
            </div>
            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Session Date
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {formatDate(
                  getAttendanceReport.data?.session_id.start_time || ""
                )}
              </dd>
            </div>

            <div className="border-t border-gray-100 px-4 py-6 sm:col-span-1 sm:px-0">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                Face Recognition Status
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:mt-2">
                {getAttendanceReport.data?.face_recognition_status ===
                "SUCCESS" ? (
                  <Badge color="green">Success</Badge>
                ) : (
                  <Badge color="red">Failed</Badge>
                )}
              </dd>
            </div>
          </dl>
          <div className="border-t border-gray-100 px-4 py-6 sm:col-span-2 sm:px-0">
            <dd className="text-sm text-gray-900">
              {/* 2 column and 2 row on small */}
              <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 sm:gap-20">
                <div className="col-span-1">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Inital Image
                  </dt>
                  <img
                    className="h-auto w-full max-w-xs mt-4 transition-all duration-300 rounded-lg blur-lg hover:blur-none"
                    src={getAttendanceReport.data?.init_face_image}
                    alt="Inital image"
                  />
                </div>
                <div className="col-span-1">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Attendance Image
                  </dt>
                  <img
                    className="h-auto w-full max-w-xs mt-4 transition-all duration-300 rounded-lg blur-lg hover:blur-none"
                    src={getAttendanceReport.data?.face_image}
                    alt="Attendance image"
                  />
                </div>
              </div>
            </dd>
          </div>
        </div>
      </div>
    </>
  );
};
