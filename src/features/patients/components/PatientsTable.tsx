'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'

interface PatientRow {
  id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  gender: string | null
}

interface PatientsTableProps {
  patients: PatientRow[]
}

export function PatientsTable({ patients }: PatientsTableProps) {
  const [search, setSearch] = useState('')

  const filtered = patients.filter(p => {
    const fullName = `${p.first_name} ${p.last_name}`.toLowerCase()
    return fullName.includes(search.toLowerCase())
  })

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar paciente..."
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Nombre</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden sm:table-cell">Email</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Telefono</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Genero</th>
              <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Accion</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map((patient) => (
              <tr key={patient.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm font-medium text-slate-900">{patient.first_name} {patient.last_name}</td>
                <td className="px-6 py-4 text-sm text-slate-500 hidden sm:table-cell">{patient.email || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">{patient.phone || '-'}</td>
                <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">{patient.gender || '-'}</td>
                <td className="px-6 py-4 text-right">
                  <Link
                    href={`/patients/${patient.id}`}
                    className="text-xs px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                  >
                    Ver
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">
                  No se encontraron pacientes
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
