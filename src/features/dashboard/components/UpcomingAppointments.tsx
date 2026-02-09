'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { confirmAppointment } from '@/actions/appointments'

interface AppointmentItem {
  id: string
  start_time: string
  status: string
  patient: { first_name: string; last_name: string }
  service: { name: string }
}

interface UpcomingAppointmentsProps {
  appointments: AppointmentItem[]
}

export function UpcomingAppointments({ appointments }: UpcomingAppointmentsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Proximas Citas</h3>
      {appointments.length === 0 ? (
        <p className="text-sm text-slate-500">No hay citas proximas</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => {
            const timeStr = format(parseISO(apt.start_time), "h:mm a", { locale: es })
            const dateStr = format(parseISO(apt.start_time), "EEE d MMM", { locale: es })
            return (
              <div key={apt.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                <div className="flex items-center gap-4">
                  <div className="text-center min-w-[60px]">
                    <p className="text-xs text-slate-500">{dateStr}</p>
                    <p className="text-sm font-medium text-slate-900">{timeStr}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{apt.patient.first_name} {apt.patient.last_name}</p>
                    <p className="text-xs text-slate-500">{apt.service.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={apt.status} />
                  {apt.status === 'pending' && (
                    <form action={confirmAppointment.bind(null, apt.id)}>
                      <button type="submit" className="text-xs px-3 py-1.5 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition">
                        Confirmar
                      </button>
                    </form>
                  )}
                  <Link
                    href={`/appointments/${apt.id}`}
                    className="text-xs px-3 py-1.5 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 transition"
                  >
                    Ver
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
