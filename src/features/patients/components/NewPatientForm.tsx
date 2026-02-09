'use client'

import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { createPatient } from '@/actions/patients'

export function NewPatientForm() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await createPatient(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-600 text-white rounded-lg px-4 py-2 font-medium hover:bg-blue-700 transition text-sm"
      >
        <Plus className="size-4" />
        Nuevo Paciente
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Nuevo Paciente</h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="size-5" />
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                  <input name="first_name" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Apellido</label>
                  <input name="last_name" required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input name="email" type="email" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Telefono</label>
                  <input name="phone" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Genero</label>
                  <select name="gender" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white">
                    <option value="">Seleccionar</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
                  <input name="date_of_birth" type="date" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alergias</label>
                <textarea name="allergies" rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Ej: Penicilina, Aspirina" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notas</label>
                <textarea name="notes" rows={2} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none" placeholder="Notas adicionales" />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setOpen(false)} className="flex-1 bg-white border border-slate-300 text-slate-700 rounded-lg px-4 py-2 hover:bg-slate-50 transition text-sm font-medium">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 disabled:opacity-50 transition text-sm font-medium">
                  {loading ? 'Guardando...' : 'Guardar Paciente'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
