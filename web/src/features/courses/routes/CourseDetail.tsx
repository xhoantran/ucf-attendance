import { useParams } from "react-router-dom";
import { useGetCourse } from "../api/getCourse";
import { ListSession } from "@/features/sessions/components/ListSession";
import { CreateSession } from "@/features/sessions/components/CreateSession";
import { BreadCrumb } from "@/components/Elements/BreadCrumb";

export const CourseDetail = () => {
  const { courseId } = useParams() as { courseId: string };
  const getCourse = useGetCourse({ courseId });
  return (
    
    <>
      <BreadCrumb
        pages={[
          { name: "Courses", href: "/app/courses", current: false },
          { name: getCourse.data?.name ?? "", href: "", current: true },
        ]}
      />

      <div className="relative pb-5 sm:pb-0">
        {/* Headers */}
        <div className="md:flex md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-4 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
              {getCourse.data?.name}&apos;s Sessions
            </h2>
            {/* Add Session */}
          </div>
          <CreateSession courseId={courseId} />
        </div>
      </div>

      {/* Sessions */}
      <ListSession courseId={courseId} />
    </>
  );
};
