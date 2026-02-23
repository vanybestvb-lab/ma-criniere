import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_LOGIN = "/admin/login";

export function middleware(request: NextRequest) {
  if (process.env.SKIP_AUTH === "1") return NextResponse.next();
  const path = request.nextUrl.pathname;
  if (path === ADMIN_LOGIN) return NextResponse.next();
  if (path.startsWith("/admin")) {
    const session = request.cookies.get("admin_session");
    const demo = request.cookies.get("admin_demo");
    if (!session?.value && !demo?.value) {
      const login = new URL(ADMIN_LOGIN, request.url);
      login.searchParams.set("from", path);
      return NextResponse.redirect(login);
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
