import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfig, queryClient } from "@/lib/react-query";
import { useNotificationStore } from "@/stores/notifications";

import type { TypeSession } from "../types";

interface ICreateSession {
  course_id: string;
}

export const createSession = async (
  data: ICreateSession
): Promise<TypeSession> => {
  const res = await axios.post(`/api/v1/session/`, data);
  return res.data;
};

type UseCreateSessionOptions = {
  config?: MutationConfig<typeof createSession>;
};

export const useCreateSession = ({ config }: UseCreateSessionOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (data) => createSession(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["course", `${data.course_id}`, "session"]);
      addNotification({
        type: "success",
        title: "Success",
        message: "Session created successfully",
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
