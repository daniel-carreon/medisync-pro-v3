'use client'

import { useState } from 'react'
import Link from 'next/link'
import { resetPassword } from '@/actions/auth'

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await resetPassword(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <p className="text-emerald-700">Revisa tu correo para el enlace de recuperacion.</p>
        </div>
        <Link href="/login" className="text-sm text-blue-600 hover:underline">
          Volver al inicio de sesion
        </Link>
      </div>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-700">
          Correo electronico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="doctor@ejemplo.com"
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
        {loading ? 'Enviando...' : 'Enviar Enlace de Recuperacion'}
      </button>

      <p className="text-center text-sm text-slate-600">
        <Link href="/login" className="text-blue-600 hover:underline">
          Volver al inicio de sesion
        </Link>
      </p>
    </form>
  )
}
