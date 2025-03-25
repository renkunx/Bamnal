"use client"

import { useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { zhCN } from "date-fns/locale"
import { Calendar } from "lucide-react"

interface TimeDisplayProps {
  date: Date | string
  className?: string
}

export function TimeDisplay({ date, className = "" }: TimeDisplayProps) {
  const [showFullDate, setShowFullDate] = useState(false)
  const dateObj = typeof date === "string" ? new Date(date) : date

  const relativeTime = formatDistanceToNow(dateObj, { locale: zhCN, addSuffix: true })
  const fullTime = format(dateObj, "yyyy/MM/dd HH:mm", { locale: zhCN })

  return (
    <button
      onClick={() => setShowFullDate(!showFullDate)}
      className={`inline-flex items-center text-sm text-gray-500 hover:text-gray-700 ${className}`}
    >
      <Calendar size={14} className="mr-1" />
      {showFullDate ? fullTime : relativeTime}
    </button>
  )
} 