'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createAppointment } from '@/actions/appointments'

interface PatientOption {
  id: string
  first_name: string
  last_name: string
}

interface ServiceOption {
  id: string
  name: string
  price: number
  duration_minutes: number
}

interface NewAppointmentFormProps {
  patients: PatientOption[]
  services: ServiceOption[]
}

export function NewAppointmentForm({ patients, services }: NewAppointmentFormProps) {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    if (selectedService) {
      formData.set('duration', String(selectedService.duration_minutes))
    }
    const result = await createAppointment(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition text-sm">
        <Plus className="size-4" />
        Nueva Cita
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Nueva Cita</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="size-5" /></button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Paciente</label>
                <select name="patient_id" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
                  <option value="">Seleccionar paciente</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Servicio</label>
                <select
                  name="service_id"
                  required
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  onChange={(e) => {
                    const svc = services.find(s => s.id === e.target.value)
                    setSelectedService(svc || null)
                  }}
                >
                  <option value="">Seleccionar servicio</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} - ${s.price} ({s.duration_minutes} min)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha</label>
                  <input name="date" type="date" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Hora</label>
                  <input name="time" type="time" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>

              {selectedService && (
                <p className="text-xs text-slate-500">Duracion: {selectedService.duration_minutes} min | Precio: ${selectedService.price}</p>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 bg-white border border-slate-300 text-slate-700 rounded-lg px-4 py-2 hover:bg-slate-50 transition text-sm font-medium">Cancelar</button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium">
                  {loading ? 'Creando...' : 'Crear Cita'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
