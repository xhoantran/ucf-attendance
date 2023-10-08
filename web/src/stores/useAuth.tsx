import { axios } from "@/lib/axios";
import { useEffect } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import storage from "@/utils/storage";
import type { AuthUser } from "@/features/auth/types";
import { loginWithGoogle, getUser } from "@/features/auth";

interface IAuthState {
  user: AuthUser | null;
  loadUser: () => Promise<void | Error>;
  loginWithGoogle: (code: string) => Promise<void | Error>;
  logout: () => void;
}

export const useAuth = create<IAuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        loginWithGoogle: async (code: string) => {
          const response = await loginWithGoogle({ code });
          const { refresh, access, user } = response;
          storage.setAccessToken(access);
          storage.setRefreshToken(refresh);
          set({ user });
        },
        loadUser: async () => {
          const data = await getUser();
          set({ user: data });
        },
        logout: () => {
          storage.clearToken();
          set({ user: null });
          window.location.href =
            `${window.location.origin}/auth/login` as unknown as string;
        },
      }),
      { name: "auth" }
    )
  )
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { loadUser, logout } = useAuth();

  useEffect(() => {
    const accessToken = storage.getAccessToken();
    if (accessToken) {
      axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
      loadUser().catch(() => {
        logout();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
