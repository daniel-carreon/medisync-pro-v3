'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

interface RevenueChartProps {
  data: { date: string; total: number }[]
}

export function RevenueChart({ data }: RevenueChartProps) {
  const chartData = data.map(item => ({
    ...item,
    label: format(parseISO(item.date), 'EEE', { locale: es }),
  }))

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Ingresos - Ultimos 7 dias</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="label" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
          <Tooltip formatter={(value: number) => [`$${value.toFixed(2)}`, 'Ingresos']} />
          <Bar dataKey="total" fill="#2563eb" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
