import Link from 'next/link'

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Revisa tu correo</h1>
        <p className="text-slate-500">
          Te hemos enviado un enlace de confirmacion. Revisa tu bandeja de entrada para completar tu registro.
        </p>
        <Link
          href="/login"
          className="inline-block text-sm text-blue-600 hover:underline"
        >
          Volver al inicio de sesion
        </Link>
      </div>
    </div>
  )
}
