// frontend/app/dashboard/layout.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) router.push("/login");
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-100 p-4 shadow-md">
        <h2 className="text-lg font-bold mb-6">Work Dr</h2>
        <nav className="flex flex-col space-y-2">
          <Link href="/home" className="hover:underline">🏠 Home</Link>
          <Link href="/dashboard/shifts" className="hover:underline">📅 Plantões</Link>
          <Link href="/dashboard/institutions" className="hover:underline">🏥 Instituições</Link>
          <button
            onClick={handleLogout}
            className="mt-6 text-left text-red-600 hover:underline"
          >
            🚪 Sair
          </button>
        </nav>
      </aside>
      <main className="flex-1 p-6 bg-white">{children}</main>
    </div>
  );
}
