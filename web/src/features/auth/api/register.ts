import { authAxios } from "@/lib/axios";

import { UserResponse } from "../types";

export type RegisterCredentialsDTO = {
  email: string;
  password1: string;
  password2: string;
};

export const registerWithEmailAndPassword = async (
  data: RegisterCredentialsDTO
): Promise<UserResponse> => {
  const response = await authAxios.post("/api-auth/v1/registration", data);
  return response.data;
};
