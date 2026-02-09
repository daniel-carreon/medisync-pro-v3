import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/shared/components/StatusBadge'
import { MedicalNoteForm } from '@/features/appointments/components/MedicalNoteForm'

export default async function AppointmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: appointment } = await supabase
    .from('appointments')
    .select('*, patient:patients(*), service:services(*)')
    .eq('id', id)
    .eq('doctor_id', user.id)
    .single()

  if (!appointment) notFound()

  const { data: medicalNote } = await supabase
    .from('medical_notes')
    .select('*')
    .eq('appointment_id', id)
    .eq('doctor_id', user.id)
    .maybeSingle()

  const { data: payment } = await supabase
    .from('payments')
    .select('*')
    .eq('appointment_id', id)
    .eq('doctor_id', user.id)
    .maybeSingle()

  const patient = appointment.patient as Record<string, unknown>
  const service = appointment.service as Record<string, unknown>
  const dateStr = format(parseISO(appointment.start_time), "EEEE d 'de' MMMM yyyy, h:mm a", { locale: es })
  const isActive = appointment.status === 'pending' || appointment.status === 'confirmed'

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/calendar" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" />
        Volver a agenda
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-3">Paciente</h3>
          <p className="text-lg font-semibold text-slate-900">{patient.first_name} {patient.last_name}</p>
          <p className="text-sm text-slate-500 mt-1">{patient.email || 'Sin email'}</p>
          <p className="text-sm text-slate-500">{patient.phone || 'Sin telefono'}</p>
          {patient.allergies && (
            <div className="mt-3 flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-500" />
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{patient.allergies}</span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-3">Servicio</h3>
          <p className="text-lg font-semibold text-slate-900">{service.name}</p>
          <p className="text-sm text-slate-500 mt-1">Precio: <span className="font-medium text-slate-900">${Number(service.price).toFixed(2)}</span></p>
          <p className="text-sm text-slate-500">Duracion: {service.duration_minutes} min</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-sm font-medium text-slate-500 mb-3">Cita</h3>
          <p className="text-sm text-slate-900 capitalize">{dateStr}</p>
          <div className="mt-3">
            <StatusBadge status={appointment.status} />
          </div>
        </div>
      </div>

      {isActive && (
        <MedicalNoteForm appointmentId={id} amount={Number(service.price)} />
      )}

      {appointment.status === 'completed' && medicalNote && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Nota Medica</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-700">Diagnostico</p>
              <p className="text-sm text-slate-900 mt-1">{medicalNote.diagnosis}</p>
            </div>
            {medicalNote.prescription && (
              <div>
                <p className="text-sm font-medium text-slate-700">Receta</p>
                <p className="text-sm text-slate-900 mt-1">{medicalNote.prescription}</p>
              </div>
            )}
            {medicalNote.private_notes && (
              <div>
                <p className="text-sm font-medium text-slate-700">Notas Privadas</p>
                <p className="text-sm text-slate-500 mt-1 italic">{medicalNote.private_notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {payment && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Pago</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-slate-500">Monto</p>
              <p className="font-bold text-slate-900">${Number(payment.amount).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-slate-500">Metodo</p>
              <p className="text-slate-900">{payment.payment_method}</p>
            </div>
            <div>
              <p className="text-slate-500">Fecha</p>
              <p className="text-slate-900">{payment.payment_date}</p>
            </div>
            <div>
              <p className="text-slate-500">Estado</p>
              <StatusBadge status={payment.status} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
