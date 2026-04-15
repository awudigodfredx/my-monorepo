import React, { createContext, useContext, useState, useCallback } from "react";

const SESSION_KEY = "admin_authenticated";
const ADMIN_PASSWORD =
  (import.meta.env.VITE_ADMIN_PASSWORD as string) ?? "admin123";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(SESSION_KEY) === "true";
    } catch {
      return false;
    }
  });

  const login = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch {
        // sessionStorage unavailable — allow in-memory only
      }
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used inside AdminAuthProvider");
  return ctx;
}
