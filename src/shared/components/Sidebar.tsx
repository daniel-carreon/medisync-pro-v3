'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Calendar, Users, DollarSign, X } from 'lucide-react'

interface SidebarProps {
  open: boolean
  onClose: () => void
}

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/calendar', label: 'Agenda', icon: Calendar },
  { href: '/patients', label: 'Pacientes', icon: Users },
  { href: '/finances', label: 'Finanzas', icon: DollarSign },
]

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <span className="font-semibold text-slate-900">MediSync</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition ${
                active
                  ? 'bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-600 -ml-1 pl-3'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon className="size-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 text-center">MediSync Pro v1.0</p>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 md:fixed md:inset-y-0 bg-white border-r border-slate-200 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 w-64 bg-white flex flex-col z-50">
            <div className="absolute top-4 right-4">
              <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  )
}
