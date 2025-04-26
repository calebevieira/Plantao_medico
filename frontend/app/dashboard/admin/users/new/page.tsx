'use client'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { api } from '@/lib/api'

const schema = z.object({
  name: z.string().min(3, 'Nome obrigatório'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
  role: z.enum(['ADMIN', 'MEDICO']),
})

type FormData = z.infer<typeof schema>

export default function CreateUserPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem('token')
    try {
      await api.post('/auth/register', data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      router.push('/dashboard/admin/users')
    } catch (err: any) {
      console.error('Erro ao cadastrar usuário:', err)
      const apiError =
        err?.response?.data?.error || 'Erro ao cadastrar. Tente novamente.'
      setError(apiError)
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Criar Novo Usuário</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input placeholder="Nome" {...register('name')} />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

        <Input placeholder="Email" type="email" {...register('email')} />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <Input placeholder="Senha" type="password" {...register('password')} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        <select
          {...register('role')}
          className="w-full border p-2 rounded-md"
          defaultValue=""
        >
          <option value="" disabled>
            Tipo de usuário
          </option>
          <option value="ADMIN">Administrador</option>
          <option value="MEDICO">Médico</option>
        </select>
        {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
        </Button>
      </form>
    </div>
  )
}