"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface UserSession {
  id?: string;
  name: string;
  username: string;
  email: string;
  role: "admin" | "user";
  avatar: string;
  bio?: string;
}

interface AuthContextType {
  user: UserSession | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  setUser: React.Dispatch<React.SetStateAction<UserSession | null>>;
  login: (token: string, user: UserSession) => void;
  logout: () => void;
  updateUser: (updatedUser: Partial<UserSession>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserSession | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("photopedia_token");
      const storedUser = localStorage.getItem("photopedia_user");

      const isProtected =
        pathname === "/feed/new" ||
        pathname === "/profile/edit" ||
        pathname.startsWith("/admin");

      if (!storedToken || !storedUser) {
        setToken(null);
        setUser(null);
        setLoading(false);
        if (isProtected) {
          router.push("/login");
        }
        return;
      }

      try {
        const parsed = JSON.parse(storedUser);
        const validatedUser: UserSession = {
          id: parsed.id,
          name: parsed.name || "Creator",
          username: parsed.username || "user",
          email: parsed.email || "",
          role: parsed.role?.toString().toLowerCase() === "admin" ? "admin" : "user",
          avatar: parsed.avatar || "/avatar.jpg",
          bio: parsed.bio,
        };
        setToken(storedToken);
        setUser(validatedUser);
      } catch (err) {
        console.error("Failed to parse user session:", err);
        localStorage.removeItem("photopedia_token");
        localStorage.removeItem("photopedia_user");
        setToken(null);
        setUser(null);
        if (isProtected) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    }
  }, [pathname, router]);

  const login = (authToken: string, authUser: UserSession) => {
    setToken(authToken);
    setUser(authUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("photopedia_token", authToken);
      localStorage.setItem("photopedia_user", JSON.stringify(authUser));
      document.cookie = `photopedia_token=${authToken}; path=/; max-age=604800; SameSite=Lax`;
    }
    router.push("/feed");
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("photopedia_token");
      localStorage.removeItem("photopedia_user");
      document.cookie = "photopedia_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
    }
    router.push("/login");
  };

  const updateUser = (updatedFields: Partial<UserSession>) => {
    if (!user) return;
    const nextUser = { ...user, ...updatedFields };
    setUser(nextUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("photopedia_user", JSON.stringify(nextUser));
    }
  };

  const isAuthenticated = Boolean(user && token);
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        setUser,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Backward compatibility alias for existing components consuming useUser
export const useUser = useAuth;
