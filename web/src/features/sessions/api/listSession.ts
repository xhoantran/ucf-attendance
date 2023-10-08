import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import type { TypeSession } from "../types";

interface IListSession {
  courseId?: number | string;
}

export const listSession = async ({
  courseId,
}: IListSession): Promise<TypeSession[]> => {
  const res = await axios.get("/api/v1/session/?course_id=" + courseId);
  return res.data;
};

type QueryFnType = typeof listSession;

type useListSessionOptions = {
  courseId?: number | string;
  config?: QueryConfig<QueryFnType>;
};

export const useListSession = ({
  courseId,
  config,
}: useListSessionOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["course", `${courseId}`, "session"],
    queryFn: () => listSession({ courseId }),
  });
};
