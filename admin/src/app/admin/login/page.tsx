import { redirect } from "next/navigation";
import { loginAction } from "./actions";

export const dynamic = "force-dynamic";

type SearchParams = { searchParams: Promise<{ from?: string; error?: string }> };

export default async function AdminLoginPage({ searchParams }: SearchParams) {
  const { from, error } = await searchParams;
  const redirectTo = from ?? "/admin/dashboard";

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-gray-800">Ma Crinière Admin</h1>
        <p className="mb-4 text-sm text-gray-500">Connexion au back-office</p>
        {error === "db" && (
          <div className="mb-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <p className="font-medium">Base de données inaccessible.</p>
            <p className="mt-1">
              En dev (SQLite), vérifie que <code className="rounded bg-amber-100 px-1">admin/.env</code> contient{" "}
              <code className="rounded bg-amber-100 px-1">DATABASE_URL="file:./prisma/dev.db"</code> puis lance dans{" "}
              <code className="rounded bg-amber-100 px-1">admin/</code> : <code className="rounded bg-amber-100 px-1">npm run db:push</code> et{" "}
              <code className="rounded bg-amber-100 px-1">npm run db:seed</code>.
            </p>
            <p className="mt-1 text-xs">
              Sinon, base en ligne : voir <code className="rounded bg-amber-100 px-1">admin/SETUP-DATABASE.md</code>.
            </p>
          </div>
        )}
        {error === "invalid" && (
          <p className="mb-3 text-sm text-red-600">Email ou mot de passe incorrect.</p>
        )}
        <form action={loginAction} className="space-y-3">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              placeholder="admin@ma-criniere.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Connexion
          </button>
        </form>
        <p className="mt-3 text-xs text-gray-400">
          Démo : admin@ma-criniere.com / admin123 (après db:seed)
        </p>
      </div>
    </div>
  );
}
