import { axios } from "@/lib/axios";

import { UserResponse } from "../types";

export type LoginWithGoogleDTO = {
  code: string;
};

export const loginWithGoogle = async (
  data: LoginWithGoogleDTO
): Promise<UserResponse> => {
  const res = await axios.post("/api-auth/v1/google/", data);
  return res.data;
};
