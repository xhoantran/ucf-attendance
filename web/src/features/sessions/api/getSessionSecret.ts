import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

interface IGetSecretSession {
  sessionId: number | string;
}

interface IGetSecretSessionResponse {
  secret: string;
}

export const getSecretSession = async (
  data: IGetSecretSession
): Promise<IGetSecretSessionResponse> => {
  const res = await axios.post(`/api/v1/session/${data.sessionId}/get_secret/`);
  return res.data;
};

type QueryFnType = typeof getSecretSession;

type useGetSecretSessionOptions = {
  sessionId: number | string;
  config?: QueryConfig<QueryFnType>;
};

export const useGetSecretSession = ({
  sessionId,
  config,
}: useGetSecretSessionOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["session", `${sessionId}`, "secret"],
    queryFn: () => getSecretSession({ sessionId }),
    refetchInterval: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};
