"use client"

import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, TrendingUp, Calendar, Clock } from "lucide-react"
import { useStore } from "@/lib/store"
import { useEffect, useState } from "react"

export function QuickStats() {
  const { records, tags } = useStore()
  const [stats, setStats] = useState({
    totalRecords: 0,
    activeTags: 0,
    streak: 0,
    todayRecords: 0,
  })

  useEffect(() => {
    // Calculate total records
    const totalRecords = records.length

    // Calculate active tags (tags with at least one record)
    const tagIds = new Set(records.map((r) => r.tagId))
    const activeTags = tagIds.size

    // Calculate today's records
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayRecords = records.filter((r) => {
      const recordDate = new Date(r.createdAt)
      recordDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === today.getTime()
    }).length

    // Calculate streak (simplified version)
    let streak = 0
    const dates = records.map((r) => {
      const date = new Date(r.createdAt)
      date.setHours(0, 0, 0, 0)
      return date.getTime()
    })

    // Remove duplicates and sort
    const uniqueDates = [...new Set(dates)].sort((a, b) => b - a)

    if (uniqueDates.length > 0) {
      streak = 1
      for (let i = 1; i < uniqueDates.length; i++) {
        const prevDate = new Date(uniqueDates[i - 1])
        const currDate = new Date(uniqueDates[i])

        const diffTime = prevDate.getTime() - currDate.getTime()
        const diffDays = diffTime / (1000 * 60 * 60 * 24)

        if (diffDays === 1) {
          streak++
        } else {
          break
        }
      }
    }

    setStats({
      totalRecords,
      activeTags,
      streak,
      todayRecords,
    })
  }, [records, tags])

  return (
    <div className="grid grid-cols-2 gap-4 mb-6">
      <Card className="card-hover">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">总记录</p>
            <p className="text-xl font-bold">{stats.totalRecords}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">活跃标签</p>
            <p className="text-xl font-bold">{stats.activeTags}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">连续记录</p>
            <p className="text-xl font-bold">{stats.streak}天</p>
          </div>
        </CardContent>
      </Card>

      <Card className="card-hover">
        <CardContent className="p-4 flex items-center space-x-4">
          <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
            <Clock className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <p className="text-sm text-gray-500">今日记录</p>
            <p className="text-xl font-bold">{stats.todayRecords}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

