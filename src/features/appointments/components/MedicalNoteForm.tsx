'use client'

import { useState } from 'react'
import { completeAppointment } from '@/actions/appointments'

interface MedicalNoteFormProps {
  appointmentId: string
  amount: number
}

export function MedicalNoteForm({ appointmentId, amount }: MedicalNoteFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.set('appointment_id', appointmentId)
    formData.set('amount', String(amount))
    const result = await completeAppointment(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Completar Consulta</h3>
      <form action={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Diagnostico *</label>
          <textarea name="diagnosis" required rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]" placeholder="Diagnostico del paciente" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Receta</label>
          <textarea name="prescription" rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none min-h-[100px]" placeholder="Medicamentos y dosis" />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Notas Privadas</label>
          <textarea name="private_notes" rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Solo visibles para ti" />
          <p className="text-xs text-slate-400 mt-1">Estas notas no son visibles para el paciente</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Metodo de Pago</label>
          <select name="payment_method" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white">
            <option value="Efectivo">Efectivo</option>
            <option value="Tarjeta">Tarjeta</option>
            <option value="Transferencia">Transferencia</option>
          </select>
        </div>

        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-sm text-slate-700">Monto a cobrar: <span className="font-bold text-slate-900">${amount.toFixed(2)}</span></p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-emerald-700 disabled:opacity-50 transition"
        >
          {loading ? 'Procesando...' : 'Completar Consulta'}
        </button>
      </form>
    </div>
  )
}
