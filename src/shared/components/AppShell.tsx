'use client'

import { useState } from 'react'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

interface AppShellProps {
  children: React.ReactNode
  doctorName: string
}

export function AppShell({ children, doctorName }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="md:ml-64">
        <Header doctorName={doctorName} onMenuToggle={() => setSidebarOpen(true)} />
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
