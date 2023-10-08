import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { useNotificationStore } from "@/stores/notifications";

import type { TypeSession } from "../types";

interface IEndSession {
  sessionId: string | number;
}

export const endSession = async (data: IEndSession): Promise<TypeSession> => {
  const res = await axios.post(`/api/v1/session/${data.sessionId}/end/`);
  return res.data;
};

type UseEndSessionOptions = {
  config?: MutationConfig<typeof endSession>;
};

export const useEndSession = ({ config }: UseEndSessionOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (data) => endSession(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["course", `${data.course_id}`, "session"]);
      addNotification({
        type: "success",
        title: "Success",
        message: "Session endedd successfully",
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
