'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'

interface Institution {
  id: string
  name: string
  address: string
}

function isApiError(error: unknown): error is { response: { status: number } } {
    if (typeof error !== 'object' || error === null) {
      return false
    }
  
    if (!('response' in error)) {
      return false
    }
  
    const response = (error as { response?: unknown }).response
  
    if (typeof response !== 'object' || response === null) {
      return false
    }
  
    return 'status' in response && typeof (response as { status?: unknown }).status === 'number'
  }

export default function InstitutionsPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchInstitutions = async () => {
      const token = localStorage.getItem('token')

      if (!token) {
        router.push('/login')
        return
      }

      let payload
      try {
        payload = JSON.parse(atob(token.split('.')[1]))
        setIsAdmin(payload.role === 'ADMIN')
      } catch (err) {
        console.error('Erro ao decodificar token:', err)
        router.push('/login')
        return
      }

      try {
        const res = await api.get<Institution[]>('/institutions', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setInstitutions(res.data)
      } catch (error: unknown) {
        console.error('Erro ao buscar instituições:', error)

        if (isApiError(error) && error.response.status === 401) {
          router.push('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstitutions()
  }, [router])

  const handleJoin = async (institutionId: string) => {
    const token = localStorage.getItem('token')

    try {
      await api.patch(`/institutions/${institutionId}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Você entrou na instituição com sucesso!')
      router.refresh()
    } catch (error) {
      console.error('Erro ao entrar na instituição:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <p>Carregando instituições...</p>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Instituições</h1>
        {isAdmin && (
          <Button onClick={() => router.push('/dashboard/institutions/new')}>
            Nova Instituição
          </Button>
        )}
      </div>

      {institutions.length === 0 ? (
        <p>Nenhuma instituição encontrada.</p>
      ) : (
        <div className="space-y-2">
          {institutions.map((institution) => (
            <div
              key={institution.id}
              className="p-4 border rounded-md flex justify-between items-center"
            >
              <div>
                <p className="font-medium">{institution.name}</p>
                <p className="text-sm text-gray-500">{institution.address}</p>
              </div>
              {!isAdmin && (
                <Button
                  className="transition-colors duration-200 hover:bg-green-700"
                  onClick={() => handleJoin(institution.id)}
                >
                  Entrar
                </Button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
