"use server";

import { redirect } from "next/navigation";

import { clearAdminSessionCookies } from "../lib/auth";

export async function logoutAction() {
  await clearAdminSessionCookies();
  redirect("/login");
}
