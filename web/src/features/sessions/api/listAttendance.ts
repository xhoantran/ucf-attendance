import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import type { TypeAttendance } from "../types";

interface IListAttendance {
  sessionId?: number | string;
}

export const listAttendance = async ({
  sessionId,
}: IListAttendance): Promise<TypeAttendance[]> => {
  const res = await axios.get("/api/v1/attendance/?session_id=" + sessionId);
  return res.data;
};

type QueryFnType = typeof listAttendance;

type useListAttendanceOptions = {
  sessionId?: number | string;
  config?: QueryConfig<QueryFnType>;
};

export const useListAttendance = ({
  sessionId,
  config,
}: useListAttendanceOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["session", `${sessionId}`, "attendance"],
    queryFn: () => listAttendance({ sessionId }),
  });
};
