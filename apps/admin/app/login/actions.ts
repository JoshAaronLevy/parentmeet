"use server";

import { redirect } from "next/navigation";

import {
  clearAdminSessionCookies,
  setAdminSessionCookies
} from "../../lib/auth";
import { createSupabaseClient } from "../../lib/supabase";

export type LoginFormState = {
  error?: string;
};

export async function loginAction(
  _state: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return {
      error: "Enter an admin email and password."
    };
  }

  const supabase = createSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.session || !data.user) {
    return {
      error: error?.message ?? "Unable to sign in."
    };
  }

  const role = data.user.app_metadata.role;

  if (role !== "admin" && role !== "moderator") {
    await clearAdminSessionCookies();
    return {
      error: "This account does not have admin or moderator access."
    };
  }

  await setAdminSessionCookies({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token
  });

  redirect("/dashboard");
}
