'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'

interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'MEDICO'
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

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
        setUsers(res.data)
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Erro ao buscar usuários:', err)
        router.push('/login')
      })
  }, [router])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return

    const token = localStorage.getItem('token')

    try {
      await api.delete(`/auth/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      setUsers((prev) => prev.filter((user) => user.id !== id))
    } catch (err) {
      console.error('Erro ao excluir usuário:', err)
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <Button onClick={() => router.push('/dashboard/admin/users/new')}>
          Novo Usuário
        </Button>
      </div>

      {isLoading ? (
        <p>Carregando usuários...</p>
      ) : (
        <div className="space-y-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/dashboard/admin/users/${user.id}/edit`)
                  }
                >
                  Editar
                </Button>
                <Button variant="destructive" className="transition-colors duration-200 hover:bg-red-700" onClick={() => handleDelete(user.id)}>
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}