"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import * as authApi from "@/lib/api/auth";
import type { User } from "@/lib/types";
import { clearSession, getRefreshToken, onSessionExpired, setAccessToken as storeAccessToken, setRefreshToken } from "./authStore";

export interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyTokens = useCallback((tokens: authApi.AuthTokens) => {
    storeAccessToken(tokens.accessToken);
    setRefreshToken(tokens.refreshToken);
    setAccessTokenState(tokens.accessToken);
  }, []);

  const clearAuthState = useCallback(() => {
    clearSession();
    setAccessTokenState(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const result = await authApi.login({ email, password });
      applyTokens(result);
      setUser(result.user);
    },
    [applyTokens]
  );

  const logout = useCallback(async () => {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => undefined);
    }
    clearAuthState();
  }, [clearAuthState]);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    try {
      const tokens = await authApi.refresh(refreshToken);
      applyTokens(tokens);
      return true;
    } catch {
      clearAuthState();
      return false;
    }
  }, [applyTokens, clearAuthState]);

  useEffect(() => {
    return onSessionExpired(() => {
      setAccessTokenState(null);
      setUser(null);
    });
  }, []);

  useEffect(() => {
    (async () => {
      const hasRefreshToken = Boolean(getRefreshToken());
      if (!hasRefreshToken) {
        setIsLoading(false);
        return;
      }

      const refreshed = await refreshSession();
      if (refreshed) {
        try {
          setUser(await authApi.me());
        } catch {
          clearAuthState();
        }
      }
      setIsLoading(false);
    })();
    // Solo se ejecuta al montar la app.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, accessToken, isLoading, login, logout, refreshSession }),
    [user, accessToken, isLoading, login, logout, refreshSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
