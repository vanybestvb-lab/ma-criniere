"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import * as bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isDatabaseAvailable } from "@/lib/prisma";
import { isDemoModeEnabled, DEMO_EMAIL, DEMO_PASSWORD } from "@/mocks";

export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") ?? "/admin/dashboard";

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/admin/login?error=missing");
  }

  if (isDemoModeEnabled()) {
    if (email.trim().toLowerCase() !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
      redirect("/admin/login?error=invalid");
    }
    const cookieStore = await cookies();
    cookieStore.set("demo_auth", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });
    redirect(typeof redirectTo === "string" ? redirectTo : "/admin/dashboard");
  }

  const dbOk = await isDatabaseAvailable();
  if (!dbOk) {
    redirect("/admin/login?error=db");
  }

  let user;
  try {
    user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase(), active: true },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    const isDbError =
      msg.includes("Can't reach database") ||
      msg.includes("Connection refused") ||
      msg.includes("connect ECONNREFUSED") ||
      msg.includes("Environment variable not found") ||
      msg.includes("Unable to open the database file");
    if (isDbError) {
      redirect("/admin/login?error=db");
    }
    throw e;
  }

  if (!user) {
    redirect("/admin/login?error=invalid");
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    redirect("/admin/login?error=invalid");
  }

  const cookieStore = await cookies();
  cookieStore.set("admin_session", user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect(typeof redirectTo === "string" ? redirectTo : "/admin/dashboard");
}

/** Accès au back-office sans base de données (mode visionnage / démo). */
export async function demoModeAction() {
  const cookieStore = await cookies();
  cookieStore.set("admin_demo", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
  redirect("/admin/dashboard");
}
