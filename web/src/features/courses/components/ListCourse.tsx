import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useDeleteCourse } from "../api/deleteCourse";
import { useListCourse } from "../api/listCourse";

export const ListCourse = () => {
  const navigate = useNavigate();
  const listCourse = useListCourse();
  const deleteCourse = useDeleteCourse();

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
                  Course ID
                </th>
                <th
                  scope="col"
                  className="sticky top-0 z-10  border-b border-gray-300 bg-white bg-opacity-75 px-3 py-3.5 text-left font-semibold text-gray-900 backdrop-blur backdrop-filter "
                >
                  Name
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
              {listCourse.data?.map((course, courseIdx) => (
                <tr key={course.id} className="even:bg-gray-50">
                  <td
                    className={clsx(
                      courseIdx !== listCourse.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap hidden py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:table-cell lg:pl-8"
                    )}
                  >
                    {course.id}
                  </td>
                  <td
                    className={clsx(
                      courseIdx !== listCourse.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "whitespace-nowrap px-3 py-4 text-sm text-gray-900"
                    )}
                  >
                    {course.name}
                  </td>
                  <td
                    className={clsx(
                      courseIdx !== listCourse.data.length - 1
                        ? "border-b border-gray-200"
                        : "",
                      "flex justify-end items-center gap-x-4 py-4 pr-4 pl-3 text-sm font-medium sm:pr-8 lg:pr-8"
                    )}
                  >
                    <button
                      className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                      onClick={() => navigate(`/app/courses/${course.id}`)}
                    >
                      View
                      <span className="sr-only">, {course.name}</span>
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
                              <a
                                className={clsx(
                                  active ? "bg-gray-50" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-900"
                                )}
                              >
                                Edit
                                <span className="sr-only">, {course.name}</span>
                              </a>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <a
                                className={clsx(
                                  active ? "bg-gray-50" : "",
                                  "block px-3 py-1 text-sm leading-6 text-gray-900 cursor-pointer"
                                )}
                                onClick={() =>
                                  deleteCourse.mutate({ courseId: course.id })
                                }
                              >
                                Delete
                                <span className="sr-only">, {course.name}</span>
                              </a>
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
