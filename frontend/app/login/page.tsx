"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const response = await api.post<{ token: string }>("/auth/login", data);

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        router.push("/dashboard/home"); // ✅ Corrigido
      } else {
        setError("Token não recebido.");
        console.error("Resposta sem token:", response);
      }
    } catch (err) {
      const error = err as {
        response?: { data?: { error?: string } };
      };

      const apiError =
        error.response?.data?.error || "Erro ao fazer login. Verifique suas credenciais.";
      setError(apiError);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 border p-6 rounded-xl shadow-md"
      >
        <h1 className="text-xl font-bold">LOGIN <strong>WORK DR.</strong></h1>

        <Input type="email" placeholder="Email" {...register("email")} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <Input type="password" placeholder="Senha" {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </div>
  );
}
