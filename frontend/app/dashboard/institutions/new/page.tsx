'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner' // corrigido o import!

export default function NewInstitutionPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const token = localStorage.getItem('token')

    try {
      await api.post('/institutions', { name, address }, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success('Instituição criada com sucesso!')

      setTimeout(() => {
        router.push('/dashboard/institutions')
      }, 1500)
    } catch (err) {
      console.error('Erro ao criar instituição:', err)
      toast.error('Não foi possível criar a instituição. Tente novamente.')
    }
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Nova Instituição</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="text"
          placeholder="Nome da Instituição"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Endereço"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">
          Criar
        </Button>
      </form>
    </div>
  )
}
