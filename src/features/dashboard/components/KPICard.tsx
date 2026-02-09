import { LucideIcon } from 'lucide-react'

interface KPICardProps {
  title: string
  value: string
  icon: LucideIcon
  iconBg: string
  iconColor: string
}

export function KPICard({ title, value, icon: Icon, iconBg, iconColor }: KPICardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${iconBg}`}>
          <Icon className={`size-6 ${iconColor}`} />
        </div>
      </div>
    </div>
  )
}
