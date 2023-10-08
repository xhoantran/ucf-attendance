import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { useNotificationStore } from "@/stores/notifications";

export const deleteCourse = async (data: { courseId: number }) => {
  const res = await axios.delete(`/api/v1/course/${data.courseId}/`);
  return res.data;
};

type UseDeleteCourseOptions = {
  config?: MutationConfig<typeof deleteCourse>;
};

export const useDeleteCourse = ({ config }: UseDeleteCourseOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ["course"],
    mutationFn: (data) => deleteCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["course"]);
      addNotification({
        type: "success",
        title: "Success",
        message: "Course deleted successfully",
      });
    },
    onError: (error) => {
      addNotification({
        type: "error",
        title: "Error",
        message: error.message,
      });
    },
  });
};
