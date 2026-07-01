"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { api, clearTokens, getAccessToken, setTokens } from "@/lib/api";
import type { Account, AuthResponse, User } from "@/types";

interface AuthContextValue {
  user: User | null;
  account: Account | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (fullName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshAccount: () => Promise<void>;
  setAccount: (account: Account) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const loadSession = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    try {
      const data = await api.get<{ user: User; account: Account }>("/auth/me");
      setUser(data.user);
      setAccount(data.account);
    } catch {
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<AuthResponse>(
        "/auth/login",
        { email, password },
        { skipAuth: true }
      );
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      setAccount(data.account);
    },
    []
  );

  const register = useCallback(
    async (fullName: string, email: string, password: string) => {
      const data = await api.post<AuthResponse>(
        "/auth/register",
        { fullName, email, password },
        { skipAuth: true }
      );
      setTokens(data.accessToken, data.refreshToken);
      setUser(data.user);
      setAccount(data.account);
    },
    []
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setAccount(null);
    router.push("/login");
  }, [router]);

  const refreshAccount = useCallback(async () => {
    const data = await api.get<{ account: Account }>("/accounts/me");
    setAccount(data.account);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, account, isLoading, login, register, logout, refreshAccount, setAccount }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
