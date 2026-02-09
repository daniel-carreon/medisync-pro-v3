'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'

interface PatientSearchProps {
  onSearch: (query: string) => void
}

export function PatientSearch({ onSearch }: PatientSearchProps) {
  const [query, setQuery] = useState('')

  function handleChange(value: string) {
    setQuery(value)
    onSearch(value)
  }

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Buscar paciente..."
        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      />
    </div>
  )
}
