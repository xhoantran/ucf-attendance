import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { useNotificationStore } from "@/stores/notifications";

import type { TypeCourse } from "../types";

interface ICreateCourse {
  name: string;
}

export const createCourse = async (
  data: ICreateCourse
): Promise<TypeCourse> => {
  const res = await axios.post(`/api/v1/course/`, data);
  return res.data;
};

type UseCreateCourseOptions = {
  config?: MutationConfig<typeof createCourse>;
};

export const useCreateCourse = ({ config }: UseCreateCourseOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationKey: ["course"],
    mutationFn: (data) => createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["course"]);
      addNotification({
        type: "success",
        title: "Success",
        message: "Course created successfully",
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
