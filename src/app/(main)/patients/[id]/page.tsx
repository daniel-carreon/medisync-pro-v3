import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { StatusBadge } from '@/shared/components/StatusBadge'

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .eq('doctor_id', user.id)
    .single()

  if (!patient) notFound()

  const { data: appointments } = await supabase
    .from('appointments')
    .select('id, start_time, status, service:services(name), medical_note:medical_notes(diagnosis, prescription)')
    .eq('patient_id', id)
    .eq('doctor_id', user.id)
    .order('start_time', { ascending: false })

  const dobFormatted = patient.date_of_birth
    ? format(parseISO(patient.date_of_birth), "d 'de' MMMM, yyyy", { locale: es })
    : null

  return (
    <div className="space-y-6">
      <Link href="/patients" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700">
        <ArrowLeft className="size-4" />
        Volver a pacientes
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h1 className="text-2xl font-bold text-slate-900">{patient.first_name} {patient.last_name}</h1>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div><span className="text-slate-500">Email:</span> <span className="text-slate-900">{patient.email || '-'}</span></div>
          <div><span className="text-slate-500">Telefono:</span> <span className="text-slate-900">{patient.phone || '-'}</span></div>
          <div><span className="text-slate-500">Genero:</span> <span className="text-slate-900">{patient.gender || '-'}</span></div>
          <div><span className="text-slate-500">Fecha de Nacimiento:</span> <span className="text-slate-900">{dobFormatted || '-'}</span></div>
        </div>

        {patient.notes && (
          <div className="mt-4">
            <span className="text-sm text-slate-500">Notas:</span>
            <p className="text-sm text-slate-900 mt-1">{patient.notes}</p>
          </div>
        )}

        <div className="mt-4">
          <span className="text-sm text-slate-500">Alergias:</span>
          {patient.allergies ? (
            <div className="mt-1 flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-500" />
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">{patient.allergies}</span>
            </div>
          ) : (
            <p className="text-sm text-emerald-600 mt-1">Sin alergias conocidas</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Historial de Citas</h2>
        {!appointments || appointments.length === 0 ? (
          <p className="text-sm text-slate-500">No hay citas registradas</p>
        ) : (
          <div className="divide-y divide-slate-200">
            {appointments.map((apt: Record<string, unknown>) => {
              const aptDate = format(parseISO(apt.start_time as string), "EEE d MMM yyyy, h:mm a", { locale: es })
              const service = apt.service as { name: string } | null
              const notes = apt.medical_note as { diagnosis: string; prescription: string | null }[] | null
              const note = Array.isArray(notes) && notes.length > 0 ? notes[0] : null

              return (
                <div key={apt.id as string} className="py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-slate-900">{aptDate}</p>
                      <p className="text-xs text-slate-500">{service?.name || 'Servicio'}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge status={apt.status as string} />
                      <Link href={`/appointments/${apt.id}`} className="text-xs px-3 py-1.5 rounded-md bg-slate-50 text-slate-600 hover:bg-slate-100 transition">
                        Ver
                      </Link>
                    </div>
                  </div>
                  {note && (
                    <div className="mt-3 bg-slate-50 rounded-lg p-3 text-sm">
                      <p><span className="font-medium text-slate-700">Diagnostico:</span> {note.diagnosis}</p>
                      {note.prescription && <p className="mt-1"><span className="font-medium text-slate-700">Receta:</span> {note.prescription}</p>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
