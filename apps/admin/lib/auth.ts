import type { User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { createSupabaseClient } from "./supabase";

export const adminAccessTokenCookie = "parentmeet_admin_access_token";
export const adminRefreshTokenCookie = "parentmeet_admin_refresh_token";

export type AdminSession = {
  role: "admin" | "moderator";
  user: User;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(adminAccessTokenCookie)?.value;

  if (!accessToken) {
    return null;
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return null;
  }

  const role = data.user.app_metadata.role;

  if (role !== "admin" && role !== "moderator") {
    return null;
  }

  return {
    role,
    user: data.user
  };
}

export async function requireAdminSession() {
  const session = await getAdminSession();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function setAdminSessionCookies({
  accessToken,
  refreshToken
}: {
  accessToken: string;
  refreshToken: string;
}) {
  const cookieStore = await cookies();
  const baseOptions = {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/"
  };

  cookieStore.set(adminAccessTokenCookie, accessToken, {
    ...baseOptions,
    maxAge: 60 * 60
  });
  cookieStore.set(adminRefreshTokenCookie, refreshToken, {
    ...baseOptions,
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAdminSessionCookies() {
  const cookieStore = await cookies();

  cookieStore.delete(adminAccessTokenCookie);
  cookieStore.delete(adminRefreshTokenCookie);
}
