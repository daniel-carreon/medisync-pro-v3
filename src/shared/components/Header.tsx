'use client'

import { Menu, LogOut } from 'lucide-react'
import { signout } from '@/actions/auth'

interface HeaderProps {
  doctorName: string
  onMenuToggle: () => void
}

export function Header({ doctorName, onMenuToggle }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <button
          onClick={onMenuToggle}
          className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <Menu className="size-5" />
        </button>

        <div className="hidden md:block" />

        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-700 font-medium">{doctorName}</span>
          <form action={signout}>
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 bg-white border border-slate-300 rounded-lg px-3 py-1.5 hover:bg-slate-50 transition"
            >
              <LogOut className="size-4" />
              Salir
            </button>
          </form>
        </div>
      </div>
    </header>
  )
}
