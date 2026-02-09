'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createPatient(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('patients').insert({
    doctor_id: user.id,
    first_name: formData.get('first_name') as string,
    last_name: formData.get('last_name') as string,
    email: formData.get('email') as string || null,
    phone: formData.get('phone') as string || null,
    gender: formData.get('gender') as string || null,
    date_of_birth: formData.get('date_of_birth') as string || null,
    allergies: formData.get('allergies') as string || null,
    notes: formData.get('notes') as string || null,
  })

  if (error) return { error: error.message }

  revalidatePath('/patients')
  redirect('/patients')
}
