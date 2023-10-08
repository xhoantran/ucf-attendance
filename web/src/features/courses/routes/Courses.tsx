import { BreadCrumb } from "@/components/Elements/BreadCrumb";
import { ListCourse } from "../components/ListCourse";
import { CreateCourse } from "../components/CreateCourse";

export const Courses = () => {
  return (
    <>
      <BreadCrumb
        pages={[{ name: "Courses", href: "/app/courses", current: false }]}
      />

      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h2 className="text-2xl font-bold leading-4 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Courses
          </h2>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <CreateCourse />
        </div>
      </div>
      <ListCourse />
    </>
  );
};
