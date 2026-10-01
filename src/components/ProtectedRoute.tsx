"use client";

import { ReactNode, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getToken, removeToken } from "@/utils/storage";
import { useSelector } from "react-redux";

interface ProtectedRouteProps {
  children: ReactNode;
}

function getCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(";");
  for (let c of ca) {
    c = c.trimStart();
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }
  return undefined;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();

  const reduxToken = useSelector(
    (state: { auth?: { token?: string | null } }) => state.auth?.token
  );
  const storageToken = typeof window !== "undefined" ? getToken() : null;
  const cookieToken = getCookie("cat-admin-token");

  const hasToken = !!(reduxToken || storageToken || cookieToken);

  useEffect(() => {
    if (pathname.startsWith("/auth")) return;

    if (!hasToken) {
      removeToken();
      router.replace("/auth/login");
      return;
    }

    if (!cookieToken && storageToken) {
      try {
        const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
        document.cookie = `cat-admin-token=${encodeURIComponent(
          storageToken
        )}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
      } catch {
        /* no-op */
      }
    }
  }, [hasToken, cookieToken, storageToken, pathname, router]);

  if (!hasToken && !pathname.startsWith("/auth")) {
    return null;
  }

  return <>{children}</>;
}
