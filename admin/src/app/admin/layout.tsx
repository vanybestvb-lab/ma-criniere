import { cookies } from "next/headers";
import { AdminShell } from "@/components/AdminShell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const showDemoBadge =
    process.env.NEXT_PUBLIC_DEMO_MODE === "true" ||
    !!cookieStore.get("admin_demo")?.value ||
    !!cookieStore.get("demo_auth")?.value;
  return <AdminShell showDemoBadge={showDemoBadge}>{children}</AdminShell>;
}
