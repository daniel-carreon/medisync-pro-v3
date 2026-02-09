'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function confirmAppointment(appointmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('appointments')
    .update({ status: 'confirmed' })
    .eq('id', appointmentId)
    .eq('doctor_id', user.id)

  revalidatePath('/')
  revalidatePath('/calendar')
}

export async function cancelAppointment(appointmentId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  await supabase
    .from('appointments')
    .update({ status: 'cancelled' })
    .eq('id', appointmentId)
    .eq('doctor_id', user.id)

  revalidatePath('/')
  revalidatePath('/calendar')
}

export async function createAppointment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const patient_id = formData.get('patient_id') as string
  const service_id = formData.get('service_id') as string
  const date = formData.get('date') as string
  const time = formData.get('time') as string
  const duration = parseInt(formData.get('duration') as string) || 30

  const start_time = new Date(`${date}T${time}`)
  const end_time = new Date(start_time.getTime() + duration * 60000)

  const { error } = await supabase.from('appointments').insert({
    doctor_id: user.id,
    patient_id,
    service_id,
    start_time: start_time.toISOString(),
    end_time: end_time.toISOString(),
    status: 'pending',
  })

  if (error) return

  revalidatePath('/calendar')
  redirect('/calendar')
}

export async function completeAppointment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const appointmentId = formData.get('appointment_id') as string
  const diagnosis = formData.get('diagnosis') as string
  const prescription = formData.get('prescription') as string
  const privateNotes = formData.get('private_notes') as string
  const paymentMethod = formData.get('payment_method') as string
  const amount = parseFloat(formData.get('amount') as string)

  // 1. Create medical note
  const { error: noteError } = await supabase.from('medical_notes').insert({
    appointment_id: appointmentId,
    doctor_id: user.id,
    diagnosis,
    prescription: prescription || null,
    private_notes: privateNotes || null,
  })
  if (noteError) return

  // 2. Create payment
  const { error: payError } = await supabase.from('payments').insert({
    appointment_id: appointmentId,
    doctor_id: user.id,
    amount,
    status: 'paid',
    payment_method: paymentMethod,
  })
  if (payError) return

  // 3. Update appointment status
  const { error: aptError } = await supabase
    .from('appointments')
    .update({ status: 'completed' })
    .eq('id', appointmentId)
    .eq('doctor_id', user.id)
  if (aptError) return

  revalidatePath('/')
  revalidatePath('/calendar')
  revalidatePath(`/appointments/${appointmentId}`)
  redirect('/calendar')
}
