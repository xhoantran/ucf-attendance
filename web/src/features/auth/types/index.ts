export const ROLES = {
  ADMIN: "admin",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: (typeof ROLES)[keyof typeof ROLES];
};

export type UserResponse = {
  access: string;
  refresh: string;
  user: AuthUser;
};
