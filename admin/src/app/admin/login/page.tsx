import { redirect } from "next/navigation";
import { loginAction, demoModeAction } from "./actions";
import { isDatabaseAvailable } from "@/lib/prisma";
import { isDemoModeEnabled, DEMO_EMAIL } from "@/mocks";

export const dynamic = "force-dynamic";

type SearchParams = { searchParams: Promise<{ from?: string; error?: string }> };

export default async function AdminLoginPage({ searchParams }: SearchParams) {
  const { from, error } = await searchParams;
  const redirectTo = from ?? "/admin/dashboard";
  const demoMode = isDemoModeEnabled();
  const dbOk = demoMode ? true : await isDatabaseAvailable();
  const showDbError = !demoMode && (error === "db" || !dbOk);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="mb-4 text-xl font-bold text-gray-800">Ma Crinière Admin</h1>
        <p className="mb-4 text-sm text-gray-500">Connexion au back-office</p>
        {demoMode && (
          <p className="mb-3 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-800">
            Mode démo actif — aucun accès base de données.
          </p>
        )}
        {showDbError ? (
          <div className="mb-4 space-y-3">
            <p className="text-sm text-amber-800">
              Aucune base de données configurée. Tu peux parcourir le back-office en mode démo (sans données).
            </p>
            <form action={demoModeAction}>
              <button
                type="submit"
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-medium text-white hover:bg-primary-dark"
              >
                Accéder au back-office en mode démo
              </button>
            </form>
          </div>
        ) : (
          <>
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
                  placeholder={DEMO_EMAIL}
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
              {demoMode
                ? `Démo : ${DEMO_EMAIL} / admin123`
                : "Démo : admin@ma-criniere.com / admin123 (après db:seed)"}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
