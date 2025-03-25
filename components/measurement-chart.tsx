"use client"

import type { Record } from "@/lib/store"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { format } from "date-fns"
import { TimeDisplay } from "@/components/time-display"

interface MeasurementChartProps {
  data: Record[]
  unit: string
}

export function MeasurementChart({ data, unit }: MeasurementChartProps) {
  const chartData = data.map((record) => ({
    date: format(new Date(record.createdAt), "MM/dd"),
    value: record.measurementValue,
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={chartData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip formatter={(value) => [`${value} ${unit}`, "数值"]} labelFormatter={(label) => `日期: ${label}`}>
          <div className="text-sm text-gray-500">
            <TimeDisplay date={record.createdAt} />
          </div>
        </Tooltip>
        <Line type="monotone" dataKey="value" stroke="hsl(var(--primary))" activeDot={{ r: 8 }} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

