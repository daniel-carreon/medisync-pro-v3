import { UpdatePasswordForm } from '@/features/auth/components'

export default function UpdatePasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 p-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">
            <span className="text-xl font-bold text-white">M</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Nueva Contrasena</h1>
          <p className="mt-2 text-sm text-slate-500">Ingresa tu nueva contrasena</p>
        </div>

        <UpdatePasswordForm />
      </div>
    </div>
  )
}
