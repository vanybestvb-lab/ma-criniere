"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

/** Connexion acceptant n'importe quel email/mot de passe → redirection vers le dashboard. */
export async function loginAction(formData: FormData) {
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") ?? "/admin/dashboard";

  if (typeof email !== "string" || typeof password !== "string") {
    redirect("/admin/login?error=missing");
  }
  if (!email.trim()) {
    redirect("/admin/login?error=missing");
  }

  const cookieStore = await cookies();
  // Session "bypass" pour accéder au back-office avec les vraies données (DB), pas les mocks
  cookieStore.set("admin_session", "bypass", {
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
