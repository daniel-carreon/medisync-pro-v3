import { createClient } from '@/lib/supabase/server'
import { Users, Calendar, DollarSign, CheckCircle } from 'lucide-react'
import { KPICard } from '@/features/dashboard/components/KPICard'
import { RevenueChart } from '@/features/dashboard/components/RevenueChart'
import { UpcomingAppointments } from '@/features/dashboard/components/UpcomingAppointments'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const doctorId = user.id

  // Fetch KPIs in parallel
  const [patientsRes, todayAptsRes, monthRevenueRes, completionRes, revenueChartRes, upcomingRes] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact', head: true }).eq('doctor_id', doctorId),
    supabase.rpc('count_today_appointments', { doctor: doctorId }).maybeSingle(),
    supabase.rpc('get_month_revenue', { doctor: doctorId }).maybeSingle(),
    supabase.rpc('get_completion_rate', { doctor: doctorId }).maybeSingle(),
    supabase.rpc('get_revenue_last_7_days', { doctor: doctorId }),
    supabase.from('appointments')
      .select('id, start_time, status, patient:patients(first_name, last_name), service:services(name)')
      .eq('doctor_id', doctorId)
      .gte('start_time', new Date().toISOString())
      .in('status', ['pending', 'confirmed'])
      .order('start_time', { ascending: true })
      .limit(5),
  ])

  const totalPatients = patientsRes.count || 0
  const todayApts = todayAptsRes.data?.count || 0
  const monthRevenue = monthRevenueRes.data?.total || 0
  const completionRate = completionRes.data?.rate || 0

  const revenueData = (revenueChartRes.data || []) as { date: string; total: number }[]

  const upcoming = (upcomingRes.data || []).map((a: Record<string, unknown>) => ({
    id: a.id as string,
    start_time: a.start_time as string,
    status: a.status as string,
    patient: a.patient as { first_name: string; last_name: string },
    service: a.service as { name: string },
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Inicio</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard title="Pacientes Totales" value={String(totalPatients)} icon={Users} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <KPICard title="Citas Hoy" value={String(todayApts)} icon={Calendar} iconBg="bg-amber-100" iconColor="text-amber-600" />
        <KPICard title="Ingresos del Mes" value={`$${Number(monthRevenue).toFixed(2)}`} icon={DollarSign} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <KPICard title="Tasa de Completadas" value={`${Math.round(Number(completionRate))}%`} icon={CheckCircle} iconBg="bg-purple-100" iconColor="text-purple-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <UpcomingAppointments appointments={upcoming} />
      </div>
    </div>
  )
}
