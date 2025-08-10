"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type UserRole = "general" | "agent" | "staff" | null;
export type AgentType = "licensed" | "unlicensed" | null;

export type SessionUser = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  agentType?: AgentType;
  verified: boolean;
  nationalId?: string;
};

export type AuthContextValue = {
  user: SessionUser | null;
  login: (user: SessionUser) => void;
  logout: () => void;
  startEmailVerification: (email: string) => string; // returns token
  verifyByToken: (token: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "demo_auth_session";
const VERIFY_KEY_PREFIX = "demo_verify_token_";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        // ignore
      }
    }
  }, []);

  const login = useCallback((newUser: SessionUser) => {
    setUser(newUser);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY);
  }, []);

  const startEmailVerification = useCallback((email: string) => {
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36);
    if (typeof window !== "undefined") {
      localStorage.setItem(VERIFY_KEY_PREFIX + token, JSON.stringify({ email, createdAt: Date.now() }));
    }
    return token;
  }, []);

  const verifyByToken = useCallback((token: string) => {
    if (typeof window === "undefined") return false;
    const raw = localStorage.getItem(VERIFY_KEY_PREFIX + token);
    if (!raw) return false;
    localStorage.removeItem(VERIFY_KEY_PREFIX + token);
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, verified: true };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    return true;
  }, []);

  const value = useMemo<AuthContextValue>(() => ({ user, login, logout, startEmailVerification, verifyByToken }), [user, login, logout, startEmailVerification, verifyByToken]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}