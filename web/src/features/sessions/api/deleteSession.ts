import { useMutation } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { MutationConfig } from "@/lib/react-query";
import { useNotificationStore } from "@/stores/notifications";
import { TypeSession } from "../types";

export const deleteSession = async (data: {
  sessionId: number;
}): Promise<TypeSession> => {
  const res = await axios.delete(`/api/v1/session/${data.sessionId}/`);
  return res.data;
};

type UseDeleteSessionOptions = {
  config?: MutationConfig<typeof deleteSession>;
};

export const useDeleteSession = ({ config }: UseDeleteSessionOptions = {}) => {
  const { addNotification } = useNotificationStore();

  return useMutation({
    ...config,
    mutationFn: (data) => deleteSession(data),
    onSuccess: () => {
      addNotification({
        type: "success",
        title: "Success",
        message: "Session deleted successfully",
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
