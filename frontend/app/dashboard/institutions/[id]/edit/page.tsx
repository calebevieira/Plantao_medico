'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface Institution {
  id: string
  name: string
  address: string
}

export default function EditInstitutionPage() {
  const router = useRouter()
  const params = useParams()
  const institutionId = params.id as string

  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchInstitution = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/login')
        return
      }

      try {
        const res = await api.get<Institution>(`/institutions/${institutionId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        setName(res.data.name)
        setAddress(res.data.address)
      } catch (error) {
        console.error('Erro ao carregar instituição:', error)
        setError('Erro ao carregar os dados da instituição.')
      } finally {
        setLoading(false)
      }
    }

    if (institutionId) {
      fetchInstitution()
    }
  }, [institutionId, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')

    try {
      setSaving(true)
      await api.patch(`/institutions/${institutionId}`, { name, address }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Instituição atualizada com sucesso!')
      router.push('/dashboard/institutions')
    } catch (error) {
      console.error('Erro ao atualizar instituição:', error)
      setError('Erro ao atualizar a instituição.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir esta instituição?')
    if (!confirmDelete) return

    const token = localStorage.getItem('token')

    try {
      await api.delete(`/institutions/${institutionId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      alert('Instituição excluída com sucesso!')
      router.push('/dashboard/institutions')
    } catch (error) {
      console.error('Erro ao excluir instituição:', error)
      setError('Erro ao excluir a instituição.')
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <p>Carregando dados da instituição...</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Editar Instituição</h1>

      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium">Nome</label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="address" className="text-sm font-medium">Endereço</label>
          <Input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="flex items-center justify-between">
          <Button type="submit" disabled={saving}>
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>

          <Button
            type="button"
            className="bg-red-600 hover:bg-red-700"
            onClick={handleDelete}
          >
            Excluir
          </Button>
        </div>
      </form>
    </div>
  )
}
