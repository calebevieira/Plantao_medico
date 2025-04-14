"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface Shift {
  id: string;
  title: string;
  date: string;
}

export default function ShiftListPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    api
      .get<Shift[]>("/shifts", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setShifts(res.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar plantões:", err);
        router.push("/login");
      });
  }, [router]);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Lista de Plantões</h1>

      {isLoading ? (
        <p>Carregando...</p>
      ) : shifts.length === 0 ? (
        <p>Nenhum plantão encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {shifts.map((shift) => (
            <li key={shift.id} className="border p-4 rounded shadow-sm">
              <strong>{shift.title}</strong> <br />
              <span className="text-sm text-muted-foreground">{shift.date}</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
