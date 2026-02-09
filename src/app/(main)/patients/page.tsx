import { createClient } from '@/lib/supabase/server'
import { PatientsTable } from '@/features/patients/components/PatientsTable'
import { NewPatientForm } from '@/features/patients/components/NewPatientForm'

export default async function PatientsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: patients } = await supabase
    .from('patients')
    .select('id, first_name, last_name, email, phone, gender')
    .eq('doctor_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
        <NewPatientForm />
      </div>

      <PatientsTable patients={patients || []} />
    </div>
  )
}
