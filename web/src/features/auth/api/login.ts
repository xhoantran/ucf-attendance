import { authAxios } from "@/lib/axios";

import { UserResponse } from "../types";

export type LoginCredentialsDTO = {
  email: string;
  password: string;
};

export const loginWithEmailAndPassword = async (
  data: LoginCredentialsDTO
): Promise<UserResponse> => {
  const response = await authAxios.post("/api-auth/v1/login/", data);
  return response.data;
};
