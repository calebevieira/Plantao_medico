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

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Usuários</h1>
        <Button onClick={() => router.push('/dashboard/admin/users/new')} className="w-full sm:w-auto">
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
              className="p-4 border rounded-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
              <div>
                <p className="font-medium text-sm sm:text-base">{user.name}</p>
                <p className="text-xs sm:text-sm text-gray-500 break-all">{user.email}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800 uppercase">
                {user.role}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
