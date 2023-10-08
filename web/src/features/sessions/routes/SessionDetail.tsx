import { Spinner } from "@/components/Elements";
import { BreadCrumb } from "@/components/Elements/BreadCrumb";
import { useAuth } from "@/stores/useAuth";
import { formatDate } from "@/utils/format";
import { ClockIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { SignJWT } from "jose";
import { useState } from "react";
import { CSVLink } from "react-csv";
import QRCode from "react-qr-code";
import { useParams } from "react-router-dom";
import { useInterval } from "usehooks-ts";
import { useGetSession } from "../api/getSession";
import { useGetSecretSession } from "../api/getSessionSecret";
import { useListAttendance } from "../api/listAttendance";
import { useEndSession } from "../api/endSession";
import { Badge } from "@/components/Elements";

const tabs = [{ name: "QR Code" }, { name: "Attendees" }];

export const SessionDetail = () => {
  const { sessionId } = useParams() as { sessionId: string };

  // State
  const [activeTab, setActiveTab] = useState(tabs[0].name);
  const [qrCodeValue, setQrCodeValue] = useState<string>();
  const { user } = useAuth();

  const endSession = useEndSession();
  const getSession = useGetSession({ sessionId });
  const getSessionSecret = useGetSecretSession({ sessionId });
  const listAttendance = useListAttendance({ sessionId });

  useInterval(
    () => {
      new SignJWT({
        session_id: getSession.data?.id ?? "",
        teacher_id: user?.id ?? "",
      })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("10s")
        .sign(new TextEncoder().encode(getSessionSecret.data?.secret ?? ""))
        .then((token) => setQrCodeValue(token));
    },
    activeTab === "QR Code" ? 1000 : null
  );

  return (
    <>
      <BreadCrumb
        pages={[
          { name: "Courses", href: "/app/courses", current: false },
          {
            name: getSession.data?.course_id.name ?? "",
            href: "/app/courses/" + getSession.data?.course_id.id,
            current: false,
          },
          {
            name: formatDate(getSession.data?.start_time || ""),
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
              {getSession.data?.course_id.name}
            </h2>
            <div className="mt-2 flex items-center text text-gray-700">
              <ClockIcon
                className="mr-1.5 h-5 w-5 shrink-0 text-gray-500"
                aria-hidden="true"
              />
              Session: {formatDate(getSession.data?.start_time || "")}
            </div>
          </div>
          <div>
            <button
              type="button"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              onClick={() => endSession.mutate({ sessionId })}
            >
              End Session
            </button>
            <CSVLink
              data={
                listAttendance.data?.map((attendee) => ({
                  id: attendee.student_id.id,
                  name: attendee.student_id.name,
                  email: attendee.student_id.email,
                  time: formatDate(attendee.created_at),
                  face_recognition_status: attendee.face_recognition_status,
                })) || []
              }
              filename={
                getSession.data?.course_id.name +
                " - " +
                formatDate(getSession.data?.start_time || "") +
                ".csv"
              }
              className="rounded-md bg-blue-600 ml-3 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              Export <span className="sr-only">attendees</span> as CSV
            </CSVLink>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mt-10">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
            defaultValue={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                type="button"
                onClick={() => setActiveTab(tab.name)}
                className={clsx(
                  tab.name === activeTab
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
                )}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Component based on tab */}
      {activeTab === "QR Code" ? (
        <div className="py-8">
          <div className="h-auto mx-auto my-0 max-w-md w-full">
            {qrCodeValue ? (
              <QRCode
                value={qrCodeValue}
                size={256}
                level="L"
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                viewBox={`0 0 256 256`}
              />
            ) : (
              <>
                <Spinner className="m-auto" />
              </>
            )}
          </div>
        </div>
      ) : (
        // Attendees
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Email
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Time
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Facial Recognition
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {listAttendance.data?.map((attendee) => (
                      <tr key={attendee.student_id.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm text-gray-500 sm:pl-6">
                          {attendee.student_id.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {attendee.student_id.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {attendee.student_id.email}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatDate(attendee.created_at)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {attendee.face_recognition_status === "SUCCESS" ? (
                            <Badge color="green">Success</Badge>
                          ) : attendee.face_recognition_status === "FAILED" ? (
                            <Badge color="red">Failed</Badge>
                          ) : (
                            <Badge color="yellow">Pending</Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
