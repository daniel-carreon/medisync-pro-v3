'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfWeek, endOfWeek, addWeeks, eachDayOfInterval, isSameDay, parseISO, isToday } from 'date-fns'
import { es } from 'date-fns/locale'

interface CalendarAppointment {
  id: string
  start_time: string
  status: string
  patient: { first_name: string; last_name: string }
}

interface CalendarWeekViewProps {
  appointments: CalendarAppointment[]
}

const statusColors: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800 line-through',
}

export function CalendarWeekView({ appointments }: CalendarWeekViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 })
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const weekLabel = `${format(weekStart, "d MMM", { locale: es })} - ${format(weekEnd, "d MMM yyyy", { locale: es })}`

  const appointmentsByDay = useMemo(() => {
    const map: Record<string, CalendarAppointment[]> = {}
    days.forEach(day => {
      const key = format(day, 'yyyy-MM-dd')
      map[key] = appointments.filter(a => isSameDay(parseISO(a.start_time), day))
    })
    return map
  }, [appointments, days])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
        <button onClick={() => setCurrentDate(addWeeks(currentDate, -1))} className="p-2 hover:bg-slate-100 rounded-lg transition">
          <ChevronLeft className="size-5 text-slate-600" />
        </button>
        <h3 className="text-sm font-medium text-slate-900">Semana del {weekLabel}</h3>
        <button onClick={() => setCurrentDate(addWeeks(currentDate, 1))} className="p-2 hover:bg-slate-100 rounded-lg transition">
          <ChevronRight className="size-5 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 divide-x divide-slate-200">
        {days.map(day => {
          const key = format(day, 'yyyy-MM-dd')
          const dayAppts = appointmentsByDay[key] || []
          const today = isToday(day)

          return (
            <div key={key} className={`min-h-[120px] ${today ? 'bg-blue-50/50' : ''}`}>
              <div className="bg-slate-50 px-2 py-3 text-center border-b border-slate-200">
                <p className="text-xs font-medium text-slate-500 uppercase">{format(day, 'EEE', { locale: es })}</p>
                <p className={`text-sm font-medium mt-0.5 ${today ? 'text-blue-600' : 'text-slate-900'}`}>
                  {format(day, 'd')}
                </p>
              </div>
              <div className="p-2 space-y-1">
                {dayAppts.map(apt => {
                  const timeStr = format(parseISO(apt.start_time), 'HH:mm')
                  const colorClass = statusColors[apt.status] || 'bg-slate-100 text-slate-800'
                  return (
                    <Link
                      key={apt.id}
                      href={`/appointments/${apt.id}`}
                      className={`block text-xs px-2 py-1 rounded cursor-pointer hover:opacity-80 truncate ${colorClass}`}
                    >
                      {timeStr} - {apt.patient.first_name}
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
