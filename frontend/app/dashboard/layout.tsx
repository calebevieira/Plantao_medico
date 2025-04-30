'use client'

import Link from 'next/link'
import { ReactNode, useEffect, useState } from 'react'
import {
  Home,
  CalendarDays,
  Hospital,
  LogOut,
  Users,
  Menu,
} from 'lucide-react'

export default function DashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      setIsAdmin(payload.role === 'ADMIN')
    } catch {
      setIsAdmin(false)
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      {/* Mobile top bar */}
      <div className="sm:hidden flex items-center justify-between p-4 border-b bg-gray-100">
        <h1 className="text-lg font-bold">Work Dr</h1>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMenuOpen && (
        <div
          className="sm:hidden fixed top-0 left-0 w-full h-full z-50 bg-gray-100 bg-opacity-40"
          onClick={closeMenu}
        >
          <aside
            onClick={(e) => e.stopPropagation()}
            className="w-64 bg-white h-full p-6 space-y-4 absolute left-0 top-0 shadow-md"
          >
            <h1 className="text-xl font-bold">Work Dr</h1>
            <nav className="flex flex-col gap-2 text-sm">
              <Link
                href="/dashboard/home"
                className="hover:underline"
                onClick={closeMenu}
              >
                Home
              </Link>
              <Link
                href="/dashboard/shifts"
                className="hover:underline"
                onClick={closeMenu}
              >
                Plantões
              </Link>
              <Link
                href="/dashboard/institutions"
                className="hover:underline"
                onClick={closeMenu}
              >
                Instituições
              </Link>
              {isAdmin && (
                <Link
                  href="/dashboard/admin/users"
                  className="hover:underline"
                  onClick={closeMenu}
                >
                  Usuários
                </Link>
              )}
              <button
                onClick={() => {
                  localStorage.removeItem('token')
                  window.location.href = '/login'
                }}
                className="text-left text-red-600 hover:underline mt-4"
              >
                Sair
              </button>
            </nav>
          </aside>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden sm:block w-64 bg-gray-100 p-6 space-y-4 border-r">
        <h1 className="text-xl font-bold">Work Dr</h1>
        <nav className="flex flex-col gap-2 text-sm">
          <Link
            href="/dashboard/home"
            className="flex items-center gap-2 hover:underline"
          >
            <Home size={40} /> Home
          </Link>
          <Link
            href="/dashboard/shifts"
            className="flex items-center gap-2 hover:underline"
          >
            <CalendarDays size={40} /> Plantões
          </Link>
          <Link
            href="/dashboard/institutions"
            className="flex items-center gap-2 hover:underline"
          >
            <Hospital size={40} /> Instituições
          </Link>
          {isAdmin && (
            <Link
              href="/dashboard/admin/users"
              className="flex items-center gap-2 hover:underline"
            >
              <Users size={40} /> Usuários
            </Link>
          )}
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
            className="flex items-center gap-2 text-left text-red-600 hover:underline mt-4"
          >
            <LogOut size={40} /> Sair
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  )
}
