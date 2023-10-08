import { useQuery } from "@tanstack/react-query";

import { axios } from "@/lib/axios";
import { ExtractFnReturnType, QueryConfig } from "@/lib/react-query";

import type { TypeSession } from "../types";

interface IGetSession {
  sessionId: number | string;
}

export const getSession = async (data: IGetSession): Promise<TypeSession> => {
  const res = await axios.get(`/api/v1/session/${data.sessionId}/`);
  return res.data;
};

type QueryFnType = typeof getSession;

type useGetSessionOptions = {
  sessionId: number | string;
  config?: QueryConfig<QueryFnType>;
};

export const useGetSession = ({ sessionId, config }: useGetSessionOptions) => {
  return useQuery<ExtractFnReturnType<QueryFnType>>({
    ...config,
    queryKey: ["session", `${sessionId}`],
    queryFn: () => getSession({ sessionId }),
  });
};
