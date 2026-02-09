'use client'

import { useState } from 'react'
import { CalendarDays, List } from 'lucide-react'
import { CalendarWeekView } from './CalendarWeekView'
import { AppointmentsList } from './AppointmentsList'
import { NewAppointmentForm } from './NewAppointmentForm'

interface AppointmentData {
  id: string
  start_time: string
  end_time: string
  status: string
  patient: { first_name: string; last_name: string }
  service: { name: string; price: number; duration_minutes: number }
}

interface CalendarViewProps {
  appointments: AppointmentData[]
  patients: { id: string; first_name: string; last_name: string }[]
  services: { id: string; name: string; price: number; duration_minutes: number }[]
}

export function CalendarView({ appointments, patients, services }: CalendarViewProps) {
  const [view, setView] = useState<'calendar' | 'list'>('calendar')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Agenda</h1>
        <div className="flex items-center gap-3">
          <div className="flex bg-white border border-slate-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setView('calendar')}
              className={`p-2 transition ${view === 'calendar' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <CalendarDays className="size-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 transition ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <List className="size-5" />
            </button>
          </div>
          <NewAppointmentForm patients={patients} services={services} />
        </div>
      </div>

      {view === 'calendar' ? (
        <CalendarWeekView appointments={appointments} />
      ) : (
        <AppointmentsList appointments={appointments} />
      )}
    </div>
  )
}
