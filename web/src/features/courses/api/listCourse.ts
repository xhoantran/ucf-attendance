import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import type { TypeCourse } from "../types";

export const listCourse = async (): Promise<TypeCourse[]> => {
  const res = await axios.get("/api/v1/course/");
  return res.data;
};

type QueryFnType = typeof listCourse;

type useListCourseOptions = {
  config?: QueryConfig<QueryFnType>;
};

export const useListCourse = ({ config }: useListCourseOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["course"],
    queryFn: () => listCourse(),
  });
};
