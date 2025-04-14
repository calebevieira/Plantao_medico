"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import ptBrLocale from "@fullcalendar/core/locales/pt-br";
import { api } from "@/lib/api";

interface Shift {
  id: string;
  title: string;
  date: string;
}

export default function DashboardHomePage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token recuperado:", token); // ✅ Adicionado
  
    if (!token) {
      console.log("Token não encontrado. Redirecionando...");
      router.push("/login");
      return;
    }
  
    api
      .get<Shift[]>("/shifts/mine", {
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

  if (isLoading) {
    return (
      <main className="p-6">
        <p>Carregando plantões...</p>
      </main>
    );
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Meus Plantões</h1>
      <FullCalendar
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        locale={ptBrLocale}
        events={shifts.map((shift) => ({
          title: shift.title,
          date: shift.date,
        }))}
        height="auto"
      />
    </main>
  );
}
