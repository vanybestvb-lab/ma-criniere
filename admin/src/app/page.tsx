import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gray-100">
      <h1 className="text-2xl font-bold text-primary-dark">Ma Crinière</h1>
      <p className="text-gray-600">Back-Office Admin</p>
      <Link
        href="/admin/dashboard"
        className="rounded-lg bg-primary px-4 py-2 font-medium text-white hover:bg-primary-dark"
      >
        Accéder au tableau de bord
      </Link>
    </div>
  );
}
