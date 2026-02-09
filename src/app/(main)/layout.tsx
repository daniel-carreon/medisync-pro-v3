import { createClient } from '@/lib/supabase/server'
import { AppShell } from '@/shared/components/AppShell'

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let doctorName = 'Doctor'
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    doctorName = profile?.full_name || user?.email || 'Doctor'
  }

  return <AppShell doctorName={doctorName}>{children}</AppShell>
}
