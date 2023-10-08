import { axios } from "@/lib/axios";

import { AuthUser } from "../types";

export const getUser = async (): Promise<AuthUser> => {
  const res = await axios.get("/api-auth/v1/me/");
  return res.data;
};
