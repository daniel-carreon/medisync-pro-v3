'use client'

import { useState } from 'react'
import { updatePassword } from '@/actions/auth'

export function UpdatePasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await updatePassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Nueva contrasena
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          placeholder="Minimo 6 caracteres"
          className="mt-1 w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white rounded-lg px-4 py-2.5 font-medium hover:bg-blue-700 disabled:opacity-50 transition"
      >
        {loading ? 'Actualizando...' : 'Actualizar Contrasena'}
      </button>
    </form>
  )
}
