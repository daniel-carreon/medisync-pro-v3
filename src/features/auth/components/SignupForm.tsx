'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/actions/auth'

export function SignupForm() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)

    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-slate-700">
          Contrasena
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
        {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
      </button>

      <p className="text-center text-sm text-slate-600">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="text-blue-600 hover:underline">
          Iniciar sesion
        </Link>
      </p>
    </form>
  )
}
