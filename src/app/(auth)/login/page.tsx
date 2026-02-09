import { LoginForm } from '@/features/auth/components'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden md:flex md:w-1/2 bg-blue-600 text-white items-center justify-center p-12">
        <div className="max-w-md text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center">
            <span className="text-4xl font-bold">M</span>
          </div>
          <h1 className="text-3xl font-bold">MediSync Pro</h1>
          <p className="text-blue-100 text-lg">Sistema de Gestion Clinica</p>
          <div className="pt-8 space-y-3 text-sm text-blue-200">
            <p>Gestiona pacientes, citas y finanzas</p>
            <p>Historial clinico digital seguro</p>
            <p>Control financiero en tiempo real</p>
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div className="md:hidden text-center mb-4">
            <div className="mx-auto w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-3">
              <span className="text-xl font-bold text-white">M</span>
            </div>
            <h2 className="text-lg font-semibold text-blue-600">MediSync Pro</h2>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-slate-900">Bienvenido</h1>
            <p className="mt-2 text-sm text-slate-500">Inicia sesion en tu cuenta</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
