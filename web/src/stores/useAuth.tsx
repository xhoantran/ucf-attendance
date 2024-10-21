import { getUser, LoginCredentialsDTO, loginWithEmailAndPassword } from "@/features/auth";
import type { AuthUser } from "@/features/auth/types";
import { axios } from "@/lib/axios";
import storage from "@/utils/storage";
import { useEffect } from "react";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IAuthState {
  user: AuthUser | null;
  loadUser: () => Promise<void | Error>;
  login: (credentials: LoginCredentialsDTO) => Promise<void | Error>;
  logout: () => void;
}

export const useAuth = create<IAuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        login: async (credentials: LoginCredentialsDTO) => {
          const data = await loginWithEmailAndPassword(credentials);
          if (data) {
            storage.setAccessToken(data.access);
            storage.setRefreshToken(data.refresh);
            set({ user: data.user });
          }
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
