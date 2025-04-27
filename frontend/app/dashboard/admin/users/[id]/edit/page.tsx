'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MEDICO'
}

export default function EditUserPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      router.push('/login')
      return
    }

    api
      .get<User[]>('/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const foundUser = res.data.find((u) => u.id === id)
        if (foundUser) {
          setUser(foundUser)
        } else {
          router.push('/dashboard/admin/users')
        }
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao buscar usuário:', err)
        router.push('/dashboard/admin/users')
      })
  }, [id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    try {
      await api.put(`/auth/users/${id}`, {
        name: user?.name,
        email: user?.email,
        role: user?.role,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      router.push('/dashboard/admin/users')
    } catch (err) {
      console.error('Erro ao atualizar usuário:', err)
    }
  }

  if (isLoading || !user) {
    return <p className="p-6">Carregando usuário...</p>
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Editar Usuário</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Nome"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />
        <Input
          type="email"
          placeholder="Email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
        <select
          value={user.role}
          onChange={(e) => setUser({ ...user, role: e.target.value as 'ADMIN' | 'MEDICO' })}
          className="w-full border p-2 rounded"
        >
          <option value="MEDICO">Médico</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <Button type="submit" className="w-full">
          Salvar
        </Button>
      </form>
    </div>
  )
}
