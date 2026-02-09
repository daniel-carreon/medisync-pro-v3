import { createClient } from '@/lib/supabase/server'
import { CalendarView } from '@/features/appointments/components/CalendarView'

export default async function CalendarPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const [appointmentsRes, patientsRes, servicesRes] = await Promise.all([
    supabase
      .from('appointments')
      .select('id, start_time, end_time, status, notes, patient:patients(first_name, last_name), service:services(name, price, duration_minutes)')
      .eq('doctor_id', user.id)
      .order('start_time', { ascending: false }),
    supabase.from('patients').select('id, first_name, last_name').eq('doctor_id', user.id).order('first_name'),
    supabase.from('services').select('id, name, price, duration_minutes').eq('doctor_id', user.id).order('name'),
  ])

  const appointments = (appointmentsRes.data || []).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    start_time: a.start_time as string,
    end_time: a.end_time as string,
    status: a.status as string,
    patient: a.patient as { first_name: string; last_name: string },
    service: a.service as { name: string; price: number; duration_minutes: number },
  }))

  return (
    <div className="space-y-6">
      <CalendarView
        appointments={appointments}
        patients={patientsRes.data || []}
        services={servicesRes.data || []}
      />
    </div>
  )
}
