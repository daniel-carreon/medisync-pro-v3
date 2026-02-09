import { createClient } from '@/lib/supabase/server'
import { DollarSign } from 'lucide-react'
import { KPICard } from '@/features/dashboard/components/KPICard'
import { PaymentsTable } from '@/features/finances/components/PaymentsTable'

export default async function FinancesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const doctorId = user.id

  const [todayRes, weekRes, monthRes, paymentsRes] = await Promise.all([
    supabase.rpc('get_today_revenue', { doctor: doctorId }).maybeSingle(),
    supabase.rpc('get_week_revenue', { doctor: doctorId }).maybeSingle(),
    supabase.rpc('get_month_revenue', { doctor: doctorId }).maybeSingle(),
    supabase
      .from('payments')
      .select('id, amount, status, payment_method, payment_date, appointment:appointments(patient:patients(first_name, last_name), service:services(name))')
      .eq('doctor_id', doctorId)
      .order('payment_date', { ascending: false })
      .limit(50),
  ])

  const todayRevenue = todayRes.data?.total || 0
  const weekRevenue = weekRes.data?.total || 0
  const monthRevenue = monthRes.data?.total || 0

  const payments = (paymentsRes.data || []).map((p: Record<string, unknown>) => {
    const apt = p.appointment as Record<string, unknown> | null
    const patient = apt?.patient as { first_name: string; last_name: string } | null
    const service = apt?.service as { name: string } | null
    return {
      id: p.id as string,
      amount: Number(p.amount),
      status: p.status as string,
      payment_method: p.payment_method as string,
      payment_date: p.payment_date as string,
      patient_name: patient ? `${patient.first_name} ${patient.last_name}` : '-',
      service_name: service?.name || '-',
    }
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Finanzas</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard title="Ingresos Hoy" value={`$${Number(todayRevenue).toFixed(2)}`} icon={DollarSign} iconBg="bg-blue-100" iconColor="text-blue-600" />
        <KPICard title="Ingresos Esta Semana" value={`$${Number(weekRevenue).toFixed(2)}`} icon={DollarSign} iconBg="bg-emerald-100" iconColor="text-emerald-600" />
        <KPICard title="Ingresos Este Mes" value={`$${Number(monthRevenue).toFixed(2)}`} icon={DollarSign} iconBg="bg-purple-100" iconColor="text-purple-600" />
      </div>

      <PaymentsTable payments={payments} />
    </div>
  )
}
