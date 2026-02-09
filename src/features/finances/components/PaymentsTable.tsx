'use client'

import { useState } from 'react'
import { StatusBadge } from '@/shared/components/StatusBadge'

interface PaymentRow {
  id: string
  amount: number
  status: string
  payment_method: string
  payment_date: string
  patient_name: string
  service_name: string
}

interface PaymentsTableProps {
  payments: PaymentRow[]
}

export function PaymentsTable({ payments }: PaymentsTableProps) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? payments : payments.filter(p => p.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {[
          { key: 'all', label: 'Todos' },
          { key: 'paid', label: 'Pagados' },
          { key: 'pending', label: 'Pendientes' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
              filter === f.key ? 'bg-blue-600 text-white' : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Paciente</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Servicio</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Monto</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Metodo</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Estado</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden lg:table-cell">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition">
                <td className="px-6 py-4 text-sm text-slate-900">{p.patient_name}</td>
                <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">{p.service_name}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-900">${p.amount.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">{p.payment_method}</td>
                <td className="px-6 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-6 py-4 text-sm text-slate-500 hidden lg:table-cell">{p.payment_date}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No hay pagos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
