import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import type { TypeCourse } from "../types";

interface IGetCourse {
  courseId: number | string;
}

export const getCourse = async (data: IGetCourse): Promise<TypeCourse> => {
  const res = await axios.get(`/api/v1/course/${data.courseId}/`);
  return res.data;
};

type QueryFnType = typeof getCourse;

type useGetCourseOptions = {
  courseId: number | string;
  config?: QueryConfig<QueryFnType>;
};

export const useGetCourse = ({ courseId, config }: useGetCourseOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["course", courseId],
    queryFn: () => getCourse({ courseId }),
  });
};
