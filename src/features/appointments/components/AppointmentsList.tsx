'use client'

import { useState } from 'react'
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { confirmAppointment, cancelAppointment } from '@/actions/appointments'

interface AppointmentItem {
  id: string
  start_time: string
  status: string
  patient: { first_name: string; last_name: string }
  service: { name: string }
}

interface AppointmentsListProps {
  appointments: AppointmentItem[]
}

const filters = [
  { key: 'all', label: 'Todas' },
  { key: 'pending', label: 'Pendientes' },
  { key: 'confirmed', label: 'Confirmadas' },
  { key: 'completed', label: 'Completadas' },
  { key: 'cancelled', label: 'Canceladas' },
]

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter)

  return (
    <div className="space-y-4">
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
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
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Fecha</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Paciente</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3 hidden md:table-cell">Servicio</th>
              <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Estado</th>
              <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filtered.map(apt => {
              const dateStr = format(parseISO(apt.start_time), "EEE d MMM, h:mm a", { locale: es })
              return (
                <tr key={apt.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-4 text-sm text-slate-900">{dateStr}</td>
                  <td className="px-6 py-4 text-sm text-slate-900">{apt.patient.first_name} {apt.patient.last_name}</td>
                  <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">{apt.service.name}</td>
                  <td className="px-6 py-4"><StatusBadge status={apt.status} /></td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {apt.status === 'pending' && (
                        <>
                          <form action={confirmAppointment.bind(null, apt.id)}>
                            <button type="submit" className="text-xs px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition">Confirmar</button>
                          </form>
                          <form action={cancelAppointment.bind(null, apt.id)}>
                            <button type="submit" className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition">Cancelar</button>
                          </form>
                        </>
                      )}
                      {apt.status === 'confirmed' && (
                        <>
                          <Link href={`/appointments/${apt.id}`} className="text-xs px-3 py-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition">Atender</Link>
                          <form action={cancelAppointment.bind(null, apt.id)}>
                            <button type="submit" className="text-xs px-3 py-1.5 rounded-md bg-red-50 text-red-600 hover:bg-red-100 transition">Cancelar</button>
                          </form>
                        </>
                      )}
                      {apt.status === 'completed' && (
                        <Link href={`/appointments/${apt.id}`} className="text-xs px-3 py-1.5 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 transition">Ver</Link>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-sm text-slate-500">No hay citas</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
