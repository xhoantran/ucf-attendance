import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import type { TypeAttendanceReport } from "../types";

interface IListAttendanceReport {
  sessionId?: number | string;
}

export const listAttendanceReport = async ({
  sessionId,
}: IListAttendanceReport): Promise<TypeAttendanceReport[]> => {
  const res = await axios.get(
    `/api/v1/attendance/report/?session=${sessionId}`
  );
  return res.data;
};

type QueryFnType = typeof listAttendanceReport;

type useListAttendanceReportOptions = {
  sessionId?: number | string;
  config?: QueryConfig<QueryFnType>;
};

export const useListAttendanceReport = ({
  sessionId,
  config,
}: useListAttendanceReportOptions = {}) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["session", `${sessionId}`, "attendance", "report"],
    queryFn: () => listAttendanceReport({ sessionId }),
  });
};
