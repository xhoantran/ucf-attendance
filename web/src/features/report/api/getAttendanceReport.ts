import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import type { TypeAttendanceReport } from "../types";

interface IGetAttendanceReport {
  attendanceId: number | string;
}

export const getAttendanceReport = async (
  data: IGetAttendanceReport
): Promise<TypeAttendanceReport> => {
  const res = await axios.get(
    `/api/v1/attendance/${data.attendanceId}/report/`
  );
  return res.data;
};

type QueryFnType = typeof getAttendanceReport;

type useGetAttendanceReportOptions = {
  attendanceId: number | string;
  config?: QueryConfig<QueryFnType>;
};

export const useGetAttendanceReport = ({
  attendanceId,
  config,
}: useGetAttendanceReportOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["attendance", `${attendanceId}`],
    queryFn: () => getAttendanceReport({ attendanceId }),
  });
};
