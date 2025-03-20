"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { RecentRecords } from "@/components/recent-records"
import { QuickStats } from "@/components/quick-stats"
import { Sparkles, Bell } from "lucide-react"
import { useStore } from "@/lib/store"
import { useAuth } from "@/components/auth/auth-provider"

export default function Home() {
  const { user } = useAuth()
  const { fetchTags, fetchRecords, fetchReminders, tags, records } = useStore()

  useEffect(() => {
    if (user) {
      fetchTags()
      fetchRecords()
      fetchReminders()
    }
  }, [user, fetchTags, fetchRecords, fetchReminders])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-2xl font-bold">欢迎回到竹节记</h1>
          <Sparkles className="text-yellow-500" size={20} />
        </div>
        <Link href="/reminders">
          <Button variant="outline" size="sm" className="flex items-center">
            <Bell className="mr-1 h-4 w-4" /> 提醒
          </Button>
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white shadow-lg mb-8">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">今日提示</h2>
          <p className="opacity-90 mb-4">记录生活中的每一个精彩瞬间，见证成长的点滴变化。</p>
          <Button asChild variant="secondary" className="bg-white text-primary hover:bg-gray-100">
            <Link href="/records/new">立即记录</Link>
          </Button>
        </div>
        <div className="absolute right-0 bottom-0 opacity-10">
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2v20M17 5V2M7 22v-3M7 14v-3M17 19v3M17 14v-3M7 9V5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <QuickStats />

      <RecentRecords />
    </div>
  )
}

