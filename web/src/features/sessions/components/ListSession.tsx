import { Badge } from "@/components/Elements/Badge";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";

import { useDeleteSession } from "../api/deleteSession";
import { useEndSession } from "../api/endSession";
import { useListSession } from "../api/listSession";

import { queryClient } from "@/lib/react-query";
import { formatDate } from "@/utils/format";

interface ListSessionProps {
  courseId?: string;
}

export const ListSession = ({ courseId }: ListSessionProps) => {
  const navigate = useNavigate();
  const listSession = useListSession({ courseId });

  const endSession = useEndSession();
  const deleteSession = useDeleteSession();

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
                  Session ID
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-semibold text-gray-900 backdrop-blur backdrop-filter "
                >
                  Start Time
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-semibold text-gray-900 backdrop-blur backdrop-filter "
                >
                  End Time
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-center font-semibold text-gray-900 backdrop-blur backdrop-filter "
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10 border-b border-gray-300 bg-white bg-opacity-75 py-3.5 pl-3 pr-4 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
                >
                  <span className="sr-only">Edit</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {listSession.data?.map((session, sessionIdx) => (
                <tr key={session.id} className="even:bg-gray-50">
                  <td
                    className={clsx(
                      sessionIdx !== listSession.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:table-cell lg:pl-8"
                    )}
                  >
                    {session.id}
                  </td>
                  <td
                    className={clsx(
                      sessionIdx !== listSession.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                    )}
                  >
                    {formatDate(session.start_time)}
                  </td>
                  <td
                    className={clsx(
                      sessionIdx !== listSession.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                    )}
                  >
                    {session.end_time ? formatDate(session.end_time) : "-"}
                  </td>
                  <td
                    className={clsx(
                      sessionIdx !== listSession.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-center text-sm text-gray-900"
                    )}
                  >
                    {session.end_time ? (
                      <Badge color="green">Ended</Badge>
                    ) : (
                      <Badge color="yellow">Ongoing</Badge>
                    )}
                  </td>
                  <td
                    className={clsx(
                      sessionIdx !== listSession.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "flex justify-end items-center gap-x-4 py-4 pr-4 pl-3 text-sm font-medium sm:pr-8 lg:pr-8"
                    )}
                  >
                    <button
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => navigate(`/app/sessions/${session.id}`)}
                    >
                      View
                      <span className="sr-only">, sesion {session.id}</span>
                    </button>
                    <Menu as="div" className="relative flex-none">
                      <Menu.Button className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                        <span className="sr-only">Open options</span>
                        <EllipsisVerticalIcon
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </Menu.Button>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={clsx(
                                  active ? "bg-gray-50" : "",
                                  "block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900"
                                )}
                                onClick={() =>
                                  endSession.mutate({ sessionId: session.id })
                                }
                              >
                                End
                                <span className="sr-only">
                                  , session {session.id}
                                </span>
                              </button>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                className={clsx(
                                  active ? "bg-gray-50" : "",
                                  "block w-full text-left px-3 py-1 text-sm leading-6 text-gray-900"
                                )}
                                onClick={() =>
                                  deleteSession.mutate(
                                    {
                                      sessionId: session.id,
                                    },
                                    {
                                      onSuccess: () => {
                                        queryClient.invalidateQueries([
                                          "course",
                                          `${courseId}`,
                                          "session",
                                        ]);
                                      },
                                    }
                                  )
                                }
                              >
                                Delete
                                <span className="sr-only">
                                  , session {session.id}
                                </span>
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
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
