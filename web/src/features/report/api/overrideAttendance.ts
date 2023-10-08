import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { useNotificationStore } from "@/stores/notifications";

import type { TypeAttendanceReport } from "../types";

interface IOverrideAttendance {
  attendanceId: string | number;
}

export const overrideAttendance = async (
  data: IOverrideAttendance
): Promise<TypeAttendanceReport> => {
  const res = await axios.post(
    `/api/v1/attendance/${data.attendanceId}/override/`
  );
  return res.data;
};

type UseOverrideAttendanceOptions = {
  config?: MutationConfig<typeof overrideAttendance>;
};

export const useOverrideAttendance = ({
  config,
}: UseOverrideAttendanceOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (data) => overrideAttendance(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["attendance", `${data.id}`]);
      addNotification({
        type: "success",
        title: "Success",
        message: "Attendance has been successfully overriden.",
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
