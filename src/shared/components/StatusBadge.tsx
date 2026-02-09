interface StatusBadgeProps {
  status: string
}

const statusStyles: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-blue-100 text-blue-800',
  completed: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
  paid: 'bg-emerald-100 text-emerald-800',
}

const statusLabels: Record<string, string> = {
  pending: 'Pendiente',
  confirmed: 'Confirmada',
  completed: 'Completada',
  cancelled: 'Cancelada',
  paid: 'Pagado',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-slate-100 text-slate-800'
  const label = statusLabels[status] || status

  return (
    <span className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-0.5 ${style}`}>
      {label}
    </span>
  )
}
